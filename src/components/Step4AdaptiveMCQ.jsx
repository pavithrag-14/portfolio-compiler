import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Zap, 
  Award, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  Timer, 
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import AssessmentGauge from './AssessmentGauge';

export default function Step4AdaptiveMCQ({ 
  selectedRole, 
  candidateData, 
  onProceed, 
  onUpdateScore 
}) {
  const questions = selectedRole.quizQuestions || [];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [liveScore, setLiveScore] = useState(candidateData.employabilityAssessment.overallScore || 91);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (index) => {
    if (submitted[currentQIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: index }));
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQIndex] === undefined) return;
    
    const isCorrect = selectedAnswers[currentQIndex] === currentQ.correctIndex;
    setSubmitted(prev => ({ ...prev, [currentQIndex]: true }));

    // Dynamically adjust employability score based on real-time adaptive response
    const delta = isCorrect ? +2 : -1;
    const newScore = Math.min(99, Math.max(60, liveScore + delta));
    setLiveScore(newScore);
    if (onUpdateScore) {
      onUpdateScore(newScore);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setSubmitted({});
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Workflow Step 04</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>Adaptive MCQ Testing & Assessment Score</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Dynamically generated assessment tailored to verified skill gaps with real-time employability score gauge calibration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="glass-panel px-3.5 py-1.5 rounded-xl border border-cyan-500/30 flex items-center space-x-2 text-xs font-mono text-cyan-300">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span>Adaptive Mode: Active</span>
          </div>
        </div>
      </div>

      {/* 3-Column Layout Matching Graphic: Suggested Quiz left, Assessment Gauge Center, Suggested Quiz right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Interactive Adaptive Test Engine */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-cyan-500/30 flex flex-col justify-between shadow-2xl relative">
          <div>
            {/* Top Bar of Quiz */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="font-mono text-slate-400">
                  Topic: <strong className="text-slate-200">{currentQ.category}</strong>
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                currentQ.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            {/* Question prompt */}
            <h3 className="text-base font-bold text-slate-100 mb-5 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;
                const isAnswerSubmitted = submitted[currentQIndex];
                const isCorrectOpt = optIdx === currentQ.correctIndex;

                let optionStyles = "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60";

                if (isAnswerSubmitted) {
                  if (isCorrectOpt) {
                    optionStyles = "bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-semibold";
                  } else if (isSelected && !isCorrectOpt) {
                    optionStyles = "bg-rose-950/40 border-rose-500/80 text-rose-200";
                  } else {
                    optionStyles = "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyles = "bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-sm";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between ${optionStyles}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrectOpt && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on submit */}
            {submitted[currentQIndex] && (
              <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300 mb-4 animate-fadeIn space-y-1">
                <div className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI In-depth Explanation:</span>
                </div>
                <p className="text-slate-400 leading-normal">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>

            <div className="flex items-center space-x-3">
              {!submitted[currentQIndex] ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs transition-all shadow-md flex items-center space-x-1.5"
                >
                  <span>{currentQIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Speedometer Assessment Gauge (Centerpiece of step 4) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-2xl relative">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Live Calibration Engine
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Real-Time Index
              </span>
            </div>

            {/* Gauge Component */}
            <div className="py-4">
              <AssessmentGauge 
                score={liveScore} 
                maxScore={100} 
                label="Overall Employability Score" 
              />
            </div>

            {/* Score Breakdown Bars */}
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Technical Competence:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{liveScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all duration-700" style={{ width: `${liveScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Academic & Transcript Rigor:</span>
                  <span className="font-mono text-emerald-300 font-semibold">95%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Algorithmic Problem Solving:</span>
                  <span className="font-mono text-orange-300 font-semibold">{candidateData.employabilityAssessment.breakdown.problemSolvingLeetcode}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${candidateData.employabilityAssessment.breakdown.problemSolvingLeetcode}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={onProceed}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-xs tracking-wide hover:opacity-95 transition-all shadow-xl glow-cyan flex items-center justify-center space-x-2"
            >
              <span>Launch AI Real-Time Mock Interviewer (Step 05)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
