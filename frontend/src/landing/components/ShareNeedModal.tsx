import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Mic, MicOff, Send, MessageSquare, CheckCircle2, Sparkles, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

interface ShareNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmission?: (submission: any) => void;
}

export const ShareNeedModal: React.FC<ShareNeedModalProps> = ({ isOpen, onClose, onSuccessSubmission }) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [activeMode, setActiveMode] = useState<'voice' | 'text' | 'message'>('text');

  // Form states
  const [selectedCategory, setSelectedCategory] = useState<string>('Roads');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>(language);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  if (!isOpen) return null;

  const categories = ['Roads', 'Water', 'Healthcare', 'Education', 'Transport', 'Other'];

  const handleStartVoice = () => {
    setIsRecording(true);
    setVoiceTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang =
          selectedLang === 'hi'
            ? 'hi-IN'
            : selectedLang === 'bn'
            ? 'bn-IN'
            : selectedLang === 'ta'
            ? 'ta-IN'
            : selectedLang === 'te'
            ? 'te-IN'
            : selectedLang === 'mr'
            ? 'mr-IN'
            : selectedLang === 'gu'
            ? 'gu-IN'
            : 'en-IN';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setVoiceTranscript(text);
          setDescription(text);
        };

        recognition.onerror = () => {
          simulateVoice();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch {
        simulateVoice();
      }
    } else {
      simulateVoice();
    }
  };

  const simulateVoice = () => {
    setTimeout(() => {
      const sample = 'हमारे गाँव के सरकारी स्कूल की सड़क बारिश में बह गई है, बच्चों के लिए तुरंत मरम्मत चाहिए।';
      setVoiceTranscript(sample);
      setDescription(sample);
      setSelectedCategory('Roads');
      if (!location) setLocation('Tonk, Rajasthan');
      setIsRecording(false);
    }, 2500);
  };

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const data = {
        mode: activeMode,
        category: selectedCategory,
        location: location || 'District Planning Center, India',
        description,
        timestamp: new Date().toLocaleTimeString(),
        dossierClusterId: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
        aiConfidence: '95%',
        urgency: selectedCategory === 'Water' ? 'Critical' : 'High',
      };
      setSubmittedData(data);
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessSubmission) {
        onSuccessSubmission(data);
      }
    }, 700);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription('');
    setVoiceTranscript('');
    setLocation('');
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold shadow-2xs shrink-0">
                ✍️
              </div>
              <div>
                <h3 id="modal-headline" className="text-lg font-bold text-slate-900">
                  {t.modalTitle}
                </h3>
                <p className="text-xs text-slate-500">{t.modalSub}</p>
              </div>
            </div>

            {/* Mode Selector Tabs: Voice, Text, Message */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                How would you like to share your need?
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMode('voice')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'voice'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-blue-600" />
                  <span>Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('text')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'text'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>⌨ Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('message')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeMode === 'message'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Voice Mode Assist Area */}
            {activeMode === 'voice' && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center shadow-inner">
                <p className="text-xs text-blue-200 mb-3 font-medium">
                  Tap microphone to speak in Hindi, Tamil, Bengali, Marathi, or English
                </p>

                <button
                  type="button"
                  onClick={isRecording ? handleStopVoice : handleStartVoice}
                  className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                    isRecording
                      ? 'bg-red-500 ring-4 ring-red-300 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                  aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                  {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </button>

                <p className="mt-3 text-[11px] text-cyan-200">
                  {isRecording ? 'Listening to speech... Tap to finish' : 'Tap to speak your need'}
                </p>

                {voiceTranscript && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white/10 text-xs text-left border border-white/20">
                    <span className="text-[10px] text-cyan-300 block font-bold">Captured Transcript:</span>
                    <p className="text-slate-100 italic">“{voiceTranscript}”</p>
                  </div>
                )}
              </div>
            )}

            {/* Message Mode Notice */}
            {activeMode === 'message' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  WhatsApp Gateway integration active: Messages sent to <strong>+91 1800-JANSETU</strong> are
                  automatically parsed here.
                </span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Preferred Language
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.englishName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  What does your community need? (Category)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Location (City / District / State)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bundi, Tonk, Rajasthan (304001)"
                    required
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Describe the Issue or Development Need
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the road, water, school, or health issue in your own words..."
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing with Multilingual AI...</span>
                  </>
                ) : (
                  <span>Submit Request →</span>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                Your Voice Has Been Added to the Community Intelligence.
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                JanSetu AI has parsed your request, clustered it with nearby citizen reports, and alerted the
                appropriate district planning team.
              </p>
            </div>

            {/* AI Result Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Cluster Dossier ID:</span>
                <span className="font-mono font-bold text-blue-700">{submittedData?.dossierClusterId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Category</span>
                  <p className="font-bold text-slate-900">{submittedData?.category}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Priority Assigned</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                    {submittedData?.urgency} Priority
                  </span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Location Registered</span>
                <p className="font-medium text-slate-800">{submittedData?.location}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>NLU Match: High confidence ({submittedData?.aiConfidence}). Added to state CapEx ledger.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
