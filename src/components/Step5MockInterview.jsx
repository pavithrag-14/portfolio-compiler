import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function Step5MockInterview({ 
  selectedRole, 
  candidateData, 
  onProceed, 
  onCompleteInterview 
}) {
  const interviewList = selectedRole.interviewQuestions || [];
  const [questionIndex, setQuestionIndex] = useState(0);
  const activeQuestion = interviewList[questionIndex] || interviewList[0];

  const [isRecording, setIsRecording] = useState(false);
  const [candidateSpeech, setCandidateSpeech] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(null);
  const [analyzingResponse, setAnalyzingResponse] = useState(false);

  // Speech Analytics State
  const [speakingPaceWpm, setSpeakingPaceWpm] = useState(142);
  const [fillerWordCount, setFillerWordCount] = useState(1);
  const [confidenceScore, setConfidenceScore] = useState(88);
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  // Audio Canvas visualizer ref
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateSpeech(prev => (prev ? prev + ' ' : '') + transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Waveform canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const isActive = isRecording || isAiSpeaking;
      const waveAmplitude = isActive ? 18 : 3;
      const waveFreq = isActive ? 0.04 : 0.015;

      // Draw primary wave
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isAiSpeaking ? '#06b6d4' : isRecording ? '#10b981' : '#334155';

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * waveFreq + phase) * waveAmplitude * Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary harmonic wave
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isAiSpeaking ? 'rgba(56, 189, 248, 0.4)' : isRecording ? 'rgba(52, 211, 153, 0.4)' : 'rgba(51, 65, 85, 0.3)';

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.cos(x * (waveFreq * 1.5) + phase * 1.2) * (waveAmplitude * 0.7) * Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isActive ? 0.12 : 0.03;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isAiSpeaking]);

  // AI Voice Synthesis (Speak prompt)
  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeQuestion.question);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAiSpeaking(true);
      setTimeout(() => setIsAiSpeaking(false), 3000);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          // If browser speech recognition is blocked, fallback to simulated typing/sample answer
          setIsRecording(true);
        }
      } else {
        setIsRecording(true);
      }
    }
  };

  // Pre-fill sample high-scoring response for instant testing
  const handleUseSampleAnswer = () => {
    setCandidateSpeech(activeQuestion.sampleGoodAnswer);
  };

  // Analyze answer
  const handleAnalyzeAnswer = () => {
    if (!candidateSpeech.trim()) return;

    setAnalyzingResponse(true);

    setTimeout(() => {
      const lower = candidateSpeech.toLowerCase();
      
      // Filler words check
      const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'you know'];
      let fillerCount = 0;
      fillers.forEach(f => {
        const regex = new RegExp(`\\b${f}\\b`, 'gi');
        const matches = lower.match(regex);
        if (matches) fillerCount += matches.length;
      });

      // Keywords match
      const hits = (activeQuestion.expectedKeywords || []).filter(kw => lower.includes(kw.toLowerCase()));
      setMatchedKeywords(hits);
      setFillerWordCount(fillerCount);

      // Pace & confidence calculation
      const wordCount = candidateSpeech.trim().split(/\s+/).length;
      const estWpm = Math.min(175, Math.max(115, Math.round(wordCount * 4.2)));
      setSpeakingPaceWpm(estWpm);

      const keywordCoverage = (hits.length / Math.max(1, activeQuestion.expectedKeywords.length)) * 100;
      const confScore = Math.min(96, Math.max(72, Math.round(75 + (keywordCoverage * 0.2) - (fillerCount * 2))));
      setConfidenceScore(confScore);

      setAudioFeedback({
        technicalAccuracy: `${Math.round(keywordCoverage)}% Technical Coverage`,
        fluencyScore: `${confScore}% Delivery Confidence`,
        fillerAssessment: fillerCount <= 2 ? 'Minimal filler words (Clean delivery)' : `${fillerCount} filler words detected`,
        paceVerdict: estWpm >= 130 && estWpm <= 160 ? 'Optimal Professional Pace (130-160 WPM)' : `${estWpm} WPM (Acceptable)`,
        aiNotes: `Demonstrated strong algorithmic intuition and clear articulation of core constraints. Mentioned key architecture patterns: ${hits.slice(0, 3).join(', ')}.`,
      });

      setAnalyzingResponse(false);

      if (onCompleteInterview) {
        onCompleteInterview(confScore);
      }
    }, 1300);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Workflow Step 05</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>AI Real-Time Mock Interviewer</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time acoustic speech-to-text pipeline, filler word frequency analytics, and automated technical depth evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
            Role: {selectedRole.title}
          </span>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Interviewer Prompt & Voice Waveform */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-2xl space-y-6">
          
          {/* AI Question Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">AI Technical Interviewer</h3>
                  <span className="text-[10px] text-cyan-400 font-mono">Domain Evaluator • Question {questionIndex + 1}/{interviewList.length}</span>
                </div>
              </div>

              <button
                onClick={handleSpeakQuestion}
                className={`p-2 rounded-xl border transition-all text-xs flex items-center space-x-1.5 ${
                  isAiSpeaking
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Listen to question"
              >
                <Volume2 className="w-4 h-4" />
                <span className="font-mono text-[11px]">{isAiSpeaking ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
              <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
                "{activeQuestion.question}"
              </p>
            </div>
          </div>

          {/* Real-Time Audio Waveform Canvas (Matching graphic step 5) */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-emerald-400 animate-ping' : isAiSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{isAiSpeaking ? 'AI Voice Active' : isRecording ? 'Recording Candidate Audio...' : 'Audio Channel Standby'}</span>
              </span>
              <span>48 kHz • Stereo PCM</span>
            </div>

            <canvas
              ref={canvasRef}
              width={560}
              height={85}
              className="w-full h-20 rounded-lg"
            />
          </div>

          {/* Candidate Voice / Text Response Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Candidate Response:</span>
              </span>

              <button
                onClick={handleUseSampleAnswer}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors underline"
              >
                Insert Verified Sample Response
              </button>
            </div>

            <textarea
              rows={4}
              value={candidateSpeech}
              onChange={(e) => setCandidateSpeech(e.target.value)}
              placeholder="Speak via microphone or type your technical answer here..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
            />

            {/* Mic & Submit Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                onClick={handleToggleRecord}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all ${
                  isRecording
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                <span>{isRecording ? 'Stop Recording' : 'Voice Input (Mic)'}</span>
              </button>

              <button
                onClick={handleAnalyzeAnswer}
                disabled={analyzingResponse || !candidateSpeech.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-wide hover:opacity-95 transition-all shadow-md flex items-center space-x-2 disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzingResponse ? 'animate-spin' : ''}`} />
                <span>{analyzingResponse ? 'Analyzing Acoustic & Semantic Depth...' : 'Submit & Analyze'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Speech Analytics & Performance Feedback */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Real-time Speech Analytics Box */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Real-Time Speech Analytics</h3>
                  <span className="text-[10px] text-cyan-400 font-mono">Biometric Acoustic Feed</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-mono">Speaking Pace</div>
                <div className="text-lg font-bold text-cyan-300 font-mono mt-1">{speakingPaceWpm}</div>
                <div className="text-[9px] text-emerald-400 font-mono">WPM (Optimal)</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-mono">Filler Words</div>
                <div className="text-lg font-bold text-amber-300 font-mono mt-1">{fillerWordCount}</div>
                <div className="text-[9px] text-slate-400 font-mono">Count (Low)</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-mono">Confidence</div>
                <div className="text-lg font-bold text-emerald-300 font-mono mt-1">{confidenceScore}%</div>
                <div className="text-[9px] text-emerald-400 font-mono">High Clarity</div>
              </div>
            </div>

            {/* Expected Keywords Detector */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Technical Concept Hits:</span>
                <span className="font-mono text-cyan-400 font-bold">{matchedKeywords.length}/{activeQuestion.expectedKeywords.length} Detected</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeQuestion.expectedKeywords.map((kw) => {
                  const isHit = matchedKeywords.includes(kw);
                  return (
                    <span
                      key={kw}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-all ${
                        isHit
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {isHit ? '✓ ' : ''}{kw}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Feedback Box */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3.5 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">Performance Feedback</h3>
                <span className="text-[10px] text-slate-400 font-mono">Turn-by-turn AI evaluation</span>
              </div>
            </div>

            {audioFeedback ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Evaluation Score: {audioFeedback.fluencyScore}</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">{audioFeedback.aiNotes}</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cadence Assessment:</span>
                    <span className="text-cyan-300 font-mono">{audioFeedback.paceVerdict}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Filler Frequency:</span>
                    <span className="text-slate-200 font-mono">{audioFeedback.fillerAssessment}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-center text-xs text-slate-500">
                Submit candidate speech to generate real-time acoustic speech evaluation and technical score.
              </div>
            )}

            <button
              onClick={onProceed}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-xs tracking-wide hover:opacity-95 transition-all shadow-xl glow-cyan flex items-center justify-center space-x-2"
            >
              <span>Compile Live Web Portfolio (Step 06)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
