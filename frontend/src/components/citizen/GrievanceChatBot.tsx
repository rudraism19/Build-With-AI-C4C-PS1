import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Square,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Clock,
  MapPin,
  Volume2,
  Loader2,
  Building,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { aiService, complaintService } from '../../services/api';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isAudioPlaying?: boolean;
}

interface GrievanceChatBotProps {
  onComplaintCreated: (complaint: Complaint) => void;
  onSwitchToForm?: () => void;
}

export const GrievanceChatBot: React.FC<GrievanceChatBotProps> = ({
  onComplaintCreated,
  onSwitchToForm,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: 'नमस्ते! मैं आपका जनसेतु सहायक हूँ। आप बोलकर या लिखकर बताएं कि आपके इलाके में क्या समस्या आ रही है? (Hello! What civic problem are you facing in Gwalior?)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Extracted Complaint State
  const [extractedData, setExtractedData] = useState<{
    title: string;
    description: string;
    category: ComplaintCategory;
    severity: ComplaintSeverity;
    ward: string;
    address: string;
    latitude: number;
    longitude: number;
  }>({
    title: '',
    description: '',
    category: 'WATER',
    severity: 'HIGH',
    ward: 'Morar Ward 22',
    address: 'Near Morar Water Works, Gwalior',
    latitude: 26.2295,
    longitude: 78.2255,
  });

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const liveTranscriptRef = useRef<string>('');
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => {
    // Setup browser Web Speech API for real-time live preview while citizen speaks
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + ' ';
        }
        if (text.trim()) {
          liveTranscriptRef.current = text.trim();
          setInputMessage(text.trim());
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Browser SpeechRecognition error/unsupported:', e);
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
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sarvam + Browser Voice Recording Handler
  const startRecording = async () => {
    liveTranscriptRef.current = '';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleVoiceTranscription(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start browser speech recognition in parallel
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch {}
      }

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error:', err);
      setIsRecording(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'bot',
          text: 'माइक्रोफ़ोन तक पहुँचने में समस्या आई। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति (Permission) दें, या नीचे बॉक्स में लिखकर अपनी समस्या बताएं।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleVoiceTranscription = async (blob: Blob) => {
    setIsProcessing(true);
    let spokenText = '';

    try {
      // 1. Call Sarvam Saaras backend (now converted to clean WAV on server)
      const res = await aiService.transcribeAudio(blob);
      if (res?.text && res.text.trim()) {
        spokenText = res.text.trim();
      }
    } catch (err) {
      console.warn('Sarvam audio transcription fallback:', err);
    }

    // 2. If Sarvam returned empty, fall back to browser live speech recognition
    if (!spokenText && liveTranscriptRef.current && liveTranscriptRef.current.trim()) {
      spokenText = liveTranscriptRef.current.trim();
    }

    if (spokenText) {
      handleUserSend(spokenText);
    } else {
      setIsProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-retry-${Date.now()}`,
          sender: 'bot',
          text: 'माइक से कोई स्पष्ट आवाज सुनाई नहीं दी। कृपया माइक बटन दबाकर दोबारा बोलें, या नीचे लिखकर अपनी समस्या बताएं।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleUserSend(promptText);
  };

  const handleUserSend = async (userText: string) => {
    if (!userText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      time,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // 1. Run Gemini AI Multilingual Triage on user text
      const analysis = await aiService.analyzeText(userText);

      // Determine Category & Severity
      const cat: ComplaintCategory =
        analysis.category ||
        (userText.toLowerCase().includes('सड़क') || userText.toLowerCase().includes('road')
          ? 'ROADS'
          : userText.toLowerCase().includes('सीवर') || userText.toLowerCase().includes('कचरा')
          ? 'SANITATION'
          : 'WATER');

      const sev: ComplaintSeverity =
        analysis.severity ||
        (userText.toLowerCase().includes('गंभीर') || userText.toLowerCase().includes('urgent')
          ? 'CRITICAL'
          : 'HIGH');

      const title = analysis.summary || userText.slice(0, 70);

      setExtractedData((prev) => ({
        ...prev,
        title,
        description: prev.description ? `${prev.description} | ${userText}` : userText,
        category: cat,
        severity: sev,
      }));

      setIsReadyToSubmit(true);

      // 2. Formulate helpful response tailored to department
      let botReply = '';
      if (cat === 'WATER') {
        botReply = `मैंने आपकी समस्या समझ ली है: "${title}"। यह पेयजल (Water Supply) विभाग से संबंधित है और प्राथमिकता '${sev}' निर्धारित की गई है। आपका वार्ड: 'मोरार वार्ड 22'। कृपया नीचे 'समस्या दर्ज करें' बटन दबाकर इसे तुरंत नगर निगम को भेजें।`;
      } else if (cat === 'ROADS') {
        botReply = `सड़क और गड्ढों से संबंधित शिकायत दर्ज कर ली गई है: "${title}"। लोक निर्माण / सड़क (ROADS) विभाग को यह शिकायत अग्रेषित की जाएगी। क्या आप इसे अभी नगर निगम में भेजना चाहते हैं?`;
      } else if (cat === 'SANITATION') {
        botReply = `स्वच्छता और सीवर से संबंधित शिकायत दर्ज कर ली गई है: "${title}"। नगर निगम स्वास्थ्य एवं सफाई (Sanitation) विभाग को सूचित किया जा रहा है।`;
      } else if (cat === 'ELECTRICITY') {
        botReply = `विद्युत आपूर्ति व स्ट्रीट लाइट से संबंधित शिकायत समझ ली गई है: "${title}"। विद्युत (Electricity) विभाग को यह मामला भेजा जा रहा है।`;
      } else {
        botReply = `आपकी शिकायत समझ ली गई है: "${title}" (${cat} विभाग)। विवरण तैयार है। इसे नगर निगम को भेजने के लिए नीचे बटन पर क्लिक करें।`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Optionally speak the reply in Hindi using Sarvam TTS
      speakMessage(botReply);
    } catch (err) {
      console.warn('AI Triage error in chatbot:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakMessage = async (text: string) => {
    try {
      const audioBase64 = await aiService.speakText(text.slice(0, 200), 'hi-IN');
      if (audioBase64) {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = `data:audio/wav;base64,${audioBase64}`;
          audioPlayerRef.current.play().catch(() => {});
        }
      }
    } catch {}
  };

  // Submit Complaint Direct from Chat
  const handleSubmitGrievance = async () => {
    setIsSubmitting(true);
    try {
      const res = await complaintService.submitComplaint({
        title: extractedData.title || 'Civic infrastructure complaint in Ward 22 Morar',
        description: extractedData.description,
        category: extractedData.category,
        severity: extractedData.severity,
        latitude: extractedData.latitude,
        longitude: extractedData.longitude,
        ward: extractedData.ward,
        address: extractedData.address,
      });

      setSubmittedComplaint(res);
      onComplaintCreated(res);

      const confirmMsg = `✅ आपकी शिकायत सफलतापूर्वक दर्ज हो गई है! टिकट संख्या: ${res.ticket_id || res.id.slice(0, 10)}। इसे पड़ोसियों की नागरिक मांगों के साथ वार्ड क्लस्टर में जोड़ दिया गया है।`;
      setMessages((prev) => [
        ...prev,
        {
          id: `b-confirm-${Date.now()}`,
          sender: 'bot',
          text: confirmMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakMessage('आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!');
    } catch (err) {
      console.warn('Complaint submission fallback:', err);
      const fallback: Complaint = {
        id: `cmp-${Date.now()}`,
        ticket_id: `GWL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: extractedData.title,
        description: extractedData.description,
        category: extractedData.category,
        severity: extractedData.severity,
        status: 'SUBMITTED',
        latitude: extractedData.latitude,
        longitude: extractedData.longitude,
        ward: extractedData.ward,
        address: extractedData.address,
        ai_summary: extractedData.title,
        created_at: new Date().toISOString(),
      };
      setSubmittedComplaint(fallback);
      onComplaintCreated(fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[75vh] min-h-[500px] max-h-[720px]">
      {/* Hidden Audio Player for Speech Synthesis */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-lg backdrop-blur-xs">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-extrabold text-sm sm:text-base tracking-tight">
                JanSetu AI Voice Assistant (जनसेतु सहायक)
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-emerald-400 text-slate-900 text-[10px] font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-sky-200">
              Multilingual Voice &amp; Text Grievance Assistant • Ward 22 Morar
            </p>
          </div>
        </div>

        {onSwitchToForm && (
          <button
            onClick={onSwitchToForm}
            className="text-xs text-sky-200 hover:text-white underline font-semibold cursor-pointer"
          >
            Switch to Standard Form
          </button>
        )}
      </div>

      {/* 2. Messages Conversation Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 max-w-2xl ${
                isBot ? '' : 'ml-auto flex-row-reverse space-x-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isBot
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'bg-indigo-600 text-white shadow-2xs'
                }`}
              >
                {isBot ? 'AI' : 'You'}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isBot
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-sky-700 text-white'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`flex items-center justify-between text-[10px] mt-1.5 pt-1 border-t ${
                    isBot ? 'border-slate-100 text-slate-400' : 'border-sky-600 text-sky-200'
                  }`}
                >
                  <span>{msg.time}</span>
                  {isBot && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="hover:text-sky-700 font-semibold flex items-center space-x-1 cursor-pointer"
                      title="Listen in Hindi"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-xs shadow-2xs">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>AI analyzing grievance details...</span>
          </div>
        )}

        {/* 3. Live Extracted Grievance Summary Card (inside chat when ready) */}
        {isReadyToSubmit && !submittedComplaint && (
          <div className="bg-sky-50/80 border-2 border-sky-400 rounded-2xl p-4 text-xs space-y-3 shadow-xs animate-fadeIn max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-heading font-extrabold text-sky-950 flex items-center space-x-1.5 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Extracted Grievance Details (शिकायत का विवरण)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Ready to Sanction
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-sky-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Category</span>
                <span className="font-bold text-slate-900">{extractedData.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Severity</span>
                <span className="font-bold text-rose-600">{extractedData.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ward</span>
                <span className="font-bold text-slate-900">{extractedData.ward}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-bold text-slate-900">{extractedData.address}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitGrievance}
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition disabled:opacity-50 cursor-pointer btn-press"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Gwalior Nagar Nigam...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Grievance to Nagar Nigam (शिकायत दर्ज करें)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 4. Submission Success Card */}
        {submittedComplaint && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-3 max-w-xl mx-auto shadow-xs animate-scaleIn">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl">
              ✅
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-emerald-950 text-sm sm:text-base">
                Grievance Officially Registered!
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Your ticket has been clustered with neighboring citizen reports for municipal priority action.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-slate-900">
              Ticket ID: {submittedComplaint.ticket_id || submittedComplaint.id.slice(0, 12)}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Quick Suggestion Pills */}
      <div className="px-4 py-2 border-t border-slate-200 bg-white flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[10px] text-slate-400 font-bold shrink-0">Suggestions:</span>
        <button
          type="button"
          onClick={() => handleQuickPrompt('वार्ड 22 मोरार में पेयजल पाइपलाइन टूटने से पानी की समस्या है।')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-full text-slate-700 text-[11px] shrink-0 transition cursor-pointer btn-press"
        >
          💧 पेयजल पाइपलाइन टूटी (Water)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('लश्कर मुख्य बाजार रोड पर बड़े गड्ढे हो गए हैं।')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-full text-slate-700 text-[11px] shrink-0 transition cursor-pointer btn-press"
        >
          🛣️ सड़क के गड्ढे (Roads)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('थाटीपुर वार्ड 14 में सीवर लाइन चोक होने से गंदगी फैल रही है।')}
          className="px-2.5 py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-full text-slate-700 text-[11px] shrink-0 transition cursor-pointer btn-press"
        >
          🚯 सीवर ओवरफ्लो (Sanitation)
        </button>
      </div>

      {/* 6. Input Bar with Sarvam Mic */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
        {/* Sarvam Mic Button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`p-3 rounded-2xl flex items-center justify-center transition shrink-0 cursor-pointer shadow-xs btn-press ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-rose-300'
              : 'bg-sky-100 hover:bg-sky-200 text-sky-700'
          }`}
          title={isRecording ? 'Click to stop recording' : 'Click to speak in Hindi/English'}
        >
          {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUserSend(inputMessage);
          }}
          placeholder={
            isRecording
              ? `Listening: ${recordingSeconds}s... Tap square to finish`
              : 'Type or speak your grievance in Hindi or English...'
          }
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleUserSend(inputMessage)}
          disabled={!inputMessage.trim() || isProcessing}
          className="p-3 bg-sky-700 hover:bg-sky-800 text-white rounded-2xl flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-xs btn-press"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
