import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';
import { Mic, MicOff, Check, Sparkles, Volume2, Globe } from 'lucide-react';
import { TextReveal, ScrollReveal } from './common/ScrollReveal';

interface MultilingualSectionProps {
  onOpenModalWithVoice?: () => void;
}

export const MultilingualSection: React.FC<MultilingualSectionProps> = ({ onOpenModalWithVoice }) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'analyzing' | 'done'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const supportedCodes = availableLanguages.map((l) => l.code);

  const allDisplayLanguages = [
    { code: 'hi', name: 'हिन्दी', label: 'Hindi' },
    { code: 'en', name: 'English', label: 'En' },
    { code: 'mr', name: 'मराठी', label: 'Marathi' },
    { code: 'gu', name: 'ગુજરાતી', label: 'Gujarati' },
    { code: 'bn', name: 'বাংলা', label: 'Bengali' },
    { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
    { code: 'te', name: 'తెలుగు', label: 'Telugu' },
    { code: 'kn', name: 'ಕನ್ನಡ', label: 'Kannada' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', label: 'Punjabi' },
    { code: 'ml', name: 'മലയാളം', label: 'Malayalam' },
  ];

  // Web Speech API integration with graceful simulation fallback
  const startRecording = () => {
    setIsRecording(true);
    setRecordingState('listening');
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang =
          language === 'hi'
            ? 'hi-IN'
            : language === 'bn'
            ? 'bn-IN'
            : language === 'ta'
            ? 'ta-IN'
            : language === 'te'
            ? 'te-IN'
            : language === 'mr'
            ? 'mr-IN'
            : language === 'gu'
            ? 'gu-IN'
            : 'en-IN';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = () => {
          simulateDemo();
        };

        recognition.onend = () => {
          finalizeTranscription();
        };

        recognition.start();
      } catch {
        simulateDemo();
      }
    } else {
      simulateDemo();
    }
  };

  const simulateDemo = () => {
    setTimeout(() => {
      setRecordingState('analyzing');
    }, 1800);

    setTimeout(() => {
      setTranscript('गाँव के प्राथमिक स्कूल तक पक्की सड़क और पुलिया की तुरंत आवश्यकता है...');
      setRecordingState('done');
      setIsRecording(false);
    }, 3200);
  };

  const finalizeTranscription = () => {
    setRecordingState('analyzing');
    setTimeout(() => {
      setRecordingState('done');
      setIsRecording(false);
    }, 800);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    finalizeTranscription();
  };

  const toggleMic = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <section id="languages" className="py-24 bg-slate-50/70 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <ScrollReveal direction="up" delay={0}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {t.inclusionEyebrow}
            </span>
          </ScrollReveal>

          <TextReveal
            text={`${t.multilingualHeading1} ${t.multilingualHeading2}`}
            as="h2"
            className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            delay={80}
            wordStagger={35}
            highlightWords={[t.multilingualHeading2]}
            highlightClassName="text-blue-600 font-extrabold"
          />

          <ScrollReveal direction="up" delay={180}>
            <p className="mt-3 text-base sm:text-lg text-slate-600">{t.multilingualSubheading}</p>
          </ScrollReveal>
        </div>

        {/* Language Chips Grid */}
        <ScrollReveal direction="up" delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-4xl mx-auto mb-14">
            {allDisplayLanguages.map((lang) => {
              const isSelected = language === lang.code;
              const isSupported = supportedCodes.includes(lang.code as LanguageCode);

              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    if (isSupported) {
                      setLanguage(lang.code as LanguageCode);
                    }
                  }}
                  className={`px-5 py-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer group select-none ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (isSupported && (e.key === 'Enter' || e.key === ' ')) {
                      setLanguage(lang.code as LanguageCode);
                    }
                  }}
                  aria-label={`Select language: ${lang.name}`}
                >
                  <span
                    className={`text-xl font-bold transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
                    }`}
                  >
                    {lang.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {lang.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-white ml-0.5" />}
                </div>
              );
            })}

            {/* 12 More Languages Badge */}
            <div className="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-2xs">
              <span>+12 More Official Scheduled Languages</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Voice Demo Visualizer */}
        <ScrollReveal direction="up" delay={260} distance={28}>
          <div
            id="voice-demo-card"
            className="max-w-2xl mx-auto bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t.voiceDemoTitle}
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {t.bhashiniCompatible}
            </span>
          </div>

          {/* Central Voice Waveform Visualizer */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 text-white text-center shadow-inner">
            <p className="text-xs text-blue-200 font-medium mb-4">{t.tapToRecord}</p>

            {/* Animated Sound Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 h-14 mb-5">
              <div
                className={`w-1.5 bg-cyan-400 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-3 opacity-60'
                }`}
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className={`w-1.5 bg-blue-400 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-5 opacity-70'
                }`}
                style={{ animationDelay: '0.3s' }}
              />
              <div
                className={`w-1.5 bg-white rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-8'
                }`}
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className={`w-1.5 bg-orange-400 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-4 opacity-75'
                }`}
                style={{ animationDelay: '0.4s' }}
              />
              <div
                className={`w-1.5 bg-emerald-400 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-7'
                }`}
                style={{ animationDelay: '0.25s' }}
              />
              <div
                className={`w-1.5 bg-cyan-300 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-3 opacity-60'
                }`}
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className={`w-1.5 bg-blue-400 rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-6 opacity-70'
                }`}
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className={`w-1.5 bg-white rounded-full transition-all ${
                  isRecording ? 'animate-wave-bar' : 'h-4'
                }`}
                style={{ animationDelay: '0.45s' }}
              />
            </div>

            {/* Record Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`relative mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-300 ${
                isRecording
                  ? 'bg-gradient-to-tr from-red-600 to-rose-500 shadow-red-500/40 ring-4 ring-red-400 animate-pulse'
                  : 'bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/30'
              }`}
              aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
              <span className="absolute -bottom-6 text-[10px] text-cyan-200 font-semibold uppercase tracking-wider whitespace-nowrap">
                {isRecording ? 'Tap to Finish' : t.tapToSpeak}
              </span>
            </button>

            {/* Status / Output */}
            <div className="mt-8 text-xs text-slate-300 font-normal min-h-[44px] flex items-center justify-center px-4">
              {recordingState === 'idle' && <p className="italic text-slate-400">{t.listeningPrompt}</p>}
              {recordingState === 'listening' && (
                <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Recording live speech: {transcript || 'Listening to microphone stream...'}
                </p>
              )}
              {recordingState === 'analyzing' && (
                <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Bhashini NLU analyzing acoustic dialect features...
                </p>
              )}
              {recordingState === 'done' && (
                <div className="text-cyan-300 space-y-1">
                  <p className="font-semibold text-white">✓ Processed: “{transcript}”</p>
                  <p className="text-[11px] text-emerald-400">
                    Mapped to: [Category: Road Infrastructure | Geo: Rajasthan | Priority: High]
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
  );
};
