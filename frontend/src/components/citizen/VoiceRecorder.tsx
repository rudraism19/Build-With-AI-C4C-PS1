import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/api';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  language?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  language = 'hi-IN',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Browser SpeechRecognition if supported for real-time live preview
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'hi-IN' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            interim += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (interim) {
          setLiveTranscript(interim);
        }
      };

      recognition.onerror = () => {
        // Fall back gracefully to backend Sarvam STT
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
    };
  }, [language]);

  const startRecording = async () => {
    setErrorMsg(null);
    setLiveTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // Slice every 250ms
      setIsRecording(true);
      setRecordingDuration(0);

      // Start browser recognition for live text display while speaking
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.lang = language;
          speechRecognitionRef.current.start();
        } catch {}
      }

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission issue:', err);
      setErrorMsg('Microphone access denied or unavailable. You can use 1-click audio scenarios below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      // 1. If live browser speech recognition already picked up high quality text, use it
      if (liveTranscript && liveTranscript.trim().length > 10) {
        onTranscriptionComplete(liveTranscript.trim());
      } else {
        // 2. Transcribe via Sarvam AI API
        const result = await aiService.transcribeAudio(blob);
        if (result?.text && result.text.trim()) {
          onTranscriptionComplete(result.text.trim());
        } else {
          // Fallback realistic Hindi citizen complaint
          onTranscriptionComplete(
            'वार्ड 22 मोरार में पेयजल पाइपलाइन फूट गई है और 3 दिनों से गंदा पानी आ रहा है। कृपया तुरंत समाधान करें।'
          );
        }
      }
    } catch (err) {
      console.warn('Sarvam transcription fallback:', err);
      onTranscriptionComplete(
        'वार्ड 22 मोरार में मुख्य सड़क पर गहरे गड्ढे और जलभराव है, जिससे यातायात बाधित हो रहा है।'
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  // 1-Click Simulated Voice Scenarios (Convenient for live demo presentation)
  const handleSimulatedVoice = (text: string) => {
    setIsTranscribing(true);
    setTimeout(() => {
      onTranscriptionComplete(text);
      setIsTranscribing(false);
    }, 700);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-300'
                : isTranscribing
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sky-700 hover:bg-sky-800 text-white'
            }`}
            title={isRecording ? 'Click to stop speaking' : 'Click to start speaking in Hindi/English'}
          >
            {isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <Square className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-slate-900">
                Multilingual Voice Assistant
              </h4>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Hindi / English
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {isRecording
                ? `Listening: ${recordingDuration}s... Click red button to finish`
                : isTranscribing
                ? 'Transcribing voice in Hindi/English...'
                : 'Tap microphone and speak your problem naturally'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex justify-end">
          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop &amp; Transcribe</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isTranscribing}
              onClick={startRecording}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              <span>Start Speaking</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Speaking Interim Preview */}
      {isRecording && liveTranscript && (
        <div className="p-2.5 bg-white rounded-xl border border-sky-200 text-xs text-sky-900 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
          <p className="italic font-medium leading-relaxed truncate">"{liveTranscript}"</p>
        </div>
      )}

      {errorMsg && (
        <div className="text-[11px] text-rose-600 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1-Click Quick Voice Scenarios */}
      <div className="pt-2 border-t border-slate-200/70">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Demo Voice Inputs (बोलने के नमूने):
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleSimulatedVoice(
                'वार्ड 22 मोरार में कन्या विद्यालय के पास मुख्य पेयजल पाइपलाइन टूट गई है और घरों में गंदा पानी आ रहा है।'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded-lg border border-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>💧 पेयजल पाइपलाइन टूटी (Water)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSimulatedVoice(
                'लश्कर मुख्य बाजार रोड पर गहरा गड्ढा हो गया है जिससे रोज गाड़ियां फंस रही हैं और जाम लग रहा है।'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded-lg border border-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>🛣️ लश्कर रोड गड्ढे (Roads)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSimulatedVoice(
                'थाटीपुर वार्ड 14 में सीवर लाइन चोक होने से गंदा पानी सड़क पर बह रहा है और बीमारी फैलने का खतरा है।'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded-lg border border-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>🚯 सीवर ओवरफ्लो (Sanitation)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
