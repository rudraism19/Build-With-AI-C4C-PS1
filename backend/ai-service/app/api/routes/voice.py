import time
from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, status, HTTPException
from pydantic import BaseModel
import httpx

from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/voice", tags=["Sarvam Multilingual Voice Assistant"])


class TtsRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"
    speaker: str = "aditya"


import subprocess

def convert_audio_to_wav(audio_bytes: bytes) -> bytes:
    """
    Converts browser recorded audio (webm, opus, ogg, mp4, etc.) to 16kHz mono PCM WAV for Sarvam Saaras STT.
    """
    try:
        process = subprocess.Popen(
            [
                "ffmpeg",
                "-y",
                "-i",
                "pipe:0",
                "-ar",
                "16000",
                "-ac",
                "1",
                "-f",
                "wav",
                "pipe:1",
            ],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        wav_bytes, _ = process.communicate(input=audio_bytes, timeout=12)
        if process.returncode == 0 and len(wav_bytes) > 44:
            return wav_bytes
    except Exception as exc:
        logger.warning(f"Audio ffmpeg conversion error: {exc}")
    return audio_bytes


@router.post(
    "/transcribe",
    status_code=status.HTTP_200_OK,
    summary="Transcribe citizen voice recording via Sarvam AI Saaras model",
)
async def transcribe_audio(
    file: UploadFile = File(...),
    language_code: Optional[str] = Form("hi-IN"),
):
    """
    Transcribes audio bytes recorded from citizen's browser into Hindi/English text using Sarvam AI.
    Converts browser webm/opus into 16kHz mono WAV for high-accuracy recognition.
    """
    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 100:
        return {
            "text": "",
            "transcript": "",
            "language": language_code or "hi-IN",
            "status": "empty_audio",
        }

    # Convert incoming webm/opus audio into 16kHz mono WAV format expected by Sarvam
    wav_bytes = convert_audio_to_wav(audio_bytes)

    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY,
    }

    files = {
        "file": ("recording.wav", wav_bytes, "audio/wav"),
    }
    data = {
        "model": "saaras:v3",
        "language_code": language_code or "hi-IN",
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(25.0, connect=5.0)) as client:
            response = await client.post(
                "https://api.sarvam.ai/speech-to-text",
                headers=headers,
                data=data,
                files=files,
            )

            if response.status_code == 200:
                result = response.json()
                transcript = result.get("transcript", "").strip()
                detected_lang = result.get("language_code", language_code or "hi-IN")

                return {
                    "text": transcript,
                    "transcript": transcript,
                    "language": detected_lang,
                    "status": "success" if transcript else "empty_speech",
                }
            else:
                logger.warning(
                    f"Sarvam API status {response.status_code}: {response.text[:200]}"
                )
                return {
                    "text": "",
                    "transcript": "",
                    "language": language_code or "hi-IN",
                    "status": "api_error",
                    "detail": response.text[:200],
                }
    except Exception as err:
        logger.error(f"Sarvam voice transcription exception: {err}")
        return {
            "text": "",
            "transcript": "",
            "language": language_code or "hi-IN",
            "status": "error",
            "detail": str(err),
        }


@router.post(
    "/speak",
    status_code=status.HTTP_200_OK,
    summary="Text-to-speech audio synthesis via Sarvam AI Bulbul model",
)
async def speak_text(req: TtsRequest):
    """
    Synthesizes Indian language audio for the AI grievance assistant replies using Sarvam Bulbul:v3.
    """
    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY,
    }
    payload = {
        "inputs": [req.text[:500]],
        "target_language_code": req.language_code,
        "speaker": req.speaker,
        "model": "bulbul:v3",
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=5.0)) as client:
            res = await client.post(
                "https://api.sarvam.ai/text-to-speech",
                headers=headers,
                json=payload,
            )
            if res.status_code == 200:
                data = res.json()
                audios = data.get("audios", [])
                audio_base64 = audios[0] if audios else None
                return {
                    "audio_base64": audio_base64,
                    "status": "success",
                }
            else:
                logger.warning(f"Sarvam TTS failed: {res.text[:200]}")
                return {"audio_base64": None, "status": "failed"}
    except Exception as err:
        logger.error(f"Sarvam TTS exception: {err}")
        return {"audio_base64": None, "status": "error"}
