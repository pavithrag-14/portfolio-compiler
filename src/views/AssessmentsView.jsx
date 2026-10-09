import React, { useState, useEffect } from 'react';
import { api } from '../api';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Flag, 
  Save, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Award, 
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';

const DEFAULT_TOPICS = [
  { id: 'ui-ux', name: 'UI/UX Design', category: 'Design', description: 'User research, wireframing, usability heuristics, typography, interaction design, and Figma' },
  { id: 'python', name: 'Python Programming', category: 'Programming', description: 'Core Python, data structures, OOP, functional patterns, and memory management' },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'Computer Science', description: 'Arrays, Trees, Graphs, Dynamic Programming, Big-O complexity, and recursion' },
  { id: 'sql', name: 'SQL & Database Systems', category: 'Databases', description: 'Relational algebra, indexes, joins, ACID properties, normalization, and optimization' },
  { id: 'ml', name: 'Machine Learning', category: 'AI/Data Science', description: 'Supervised/unsupervised algorithms, evaluation metrics, overfitting, feature engineering' },
  { id: 'web-dev', name: 'Full Stack Web Development', category: 'Web Development', description: 'HTML/CSS/JS, React, Node.js, REST APIs, security, and performance' },
  { id: 'cloud-devops', name: 'Cloud & DevOps Engineering', category: 'Cloud/DevOps', description: 'Docker, Kubernetes, CI/CD, AWS fundamentals, infrastructure as code, monitoring' }
];

export default function AssessmentsView({ onDataChanged }) {
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState('ui-ux');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Submission & Results State
  const [unansweredBlockedList, setUnansweredBlockedList] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [saveDraftMessage, setSaveDraftMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    loadTopicsAndAttempts();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions(selectedTopic);
    }
  }, [selectedTopic]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !assessmentResult) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, assessmentResult]);

  const loadTopicsAndAttempts = async () => {
    try {
      const [topicData, attemptData] = await Promise.all([
        api.assessments.getTopics(),
        api.assessments.getAttempts()
      ]);
      const fetchedTopics = topicData?.topics || [];
      setTopics(fetchedTopics.length > 0 ? fetchedTopics : DEFAULT_TOPICS);
      setAttempts(attemptData?.attempts || []);
      if (fetchedTopics.length > 0 && !selectedTopic) {
        setSelectedTopic(fetchedTopics[0].id);
      }
    } catch (err) {
      console.warn('Backend topics note, using default topics list:', err.message);
      setTopics(DEFAULT_TOPICS);
    }
  };

  const loadQuestions = async (topicId) => {
    setLoading(true);
    setAssessmentResult(null);
    setUnansweredBlockedList(null);
    try {
      const data = await api.assessments.getQuestions(topicId);
      const qList = data.questions || [];
      setQuestions(qList);
      setCurrentQIndex(0);

      // Restore saved progress if draft exists
      const savedAnswers = data.savedAnswers || {};
      setAnswers(savedAnswers);
      setSecondsElapsed(data.savedTime || 0);
      setIsTimerRunning(true);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
    // Clear blocked warning if student is answering
    if (unansweredBlockedList) setUnansweredBlockedList(null);
  };

  const toggleFlag = (questionId) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Save progress (does NOT update skill gap or score)
  const handleSaveProgress = async () => {
    try {
      await api.assessments.saveProgress(selectedTopic, answers, secondsElapsed);
      setSaveDraftMessage('Progress saved! You can resume this attempt anytime.');
      setTimeout(() => setSaveDraftMessage(''), 3500);
    } catch (err) {
      alert('Failed to save draft: ' + err.message);
    }
  };

  // Submit assessment - STRICT RULE: Blocks if < 50 questions answered!
  const handleSubmit = async () => {
    // Audit for unanswered questions
    const unanswered = [];
    questions.forEach((q, idx) => {
      if (answers[q.id] === undefined || answers[q.id] === null) {
        unanswered.push(idx + 1);
      }
    });

    if (unanswered.length > 0) {
      // BLOCK SUBMISSION
      setUnansweredBlockedList(unanswered);
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.assessments.submit(selectedTopic, answers, secondsElapsed);
      setAssessmentResult(result);
      setIsTimerRunning(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      await loadTopicsAndAttempts();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Submission error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Calibrated 50-Question Assessments
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                15 Easy • 25 Medium • 10 Hard MCQs
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Topic Assessments & Cognitive Verification
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Strict 50-question assessments. Incomplete attempts do not alter scores. All 50 questions must be completed and submitted to calculate final accuracy and update the Skill Gap Engine.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Timer</span>
              <span className="text-xl font-black text-cyan-400 font-mono flex items-center">
                <Clock className="w-4 h-4 mr-1 text-cyan-400" />
                {formatTimer(secondsElapsed)}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Progress</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {answeredCount} / {questions.length || 50}
              </span>
            </div>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.id;
            const attempt = attempts.find(a => a.topicId === t.id && a.isCompleted);

            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md glow-cyan'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{t.name}</span>
                {attempt && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {attempt.score}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {saveDraftMessage && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{saveDraftMessage}</span>
          </div>
        )}
      </div>

      {/* Unanswered Blocked Submission Alert Banner */}
      {unansweredBlockedList && unansweredBlockedList.length > 0 && (
        <div className="p-4 bg-red-950/50 border border-red-500/60 rounded-2xl text-red-200 text-xs space-y-2 animate-pulse">
          <div className="flex items-center space-x-2 text-sm font-bold text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>Submission Blocked: {unansweredBlockedList.length} Questions Remain Unanswered!</span>
          </div>
          <p className="text-red-300/90 leading-relaxed">
            Per system integrity requirements, a 50-Question topic assessment requires all 50 questions to be answered before computing verified competency scores.
          </p>
          <div className="pt-1">
            <span className="font-semibold text-red-200 block mb-1">Click to jump to missing question:</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {unansweredBlockedList.map((qNum) => (
                <button
                  key={qNum}
                  onClick={() => {
                    setCurrentQIndex(qNum - 1);
                    setUnansweredBlockedList(null);
                  }}
                  className="px-2 py-0.5 rounded bg-red-900/60 hover:bg-red-800 text-red-200 font-mono font-bold text-[11px] border border-red-500/40"
                >
                  #{qNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Assessment Container */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Synthesizing 50 calibrated MCQs (15 Easy, 25 Medium, 10 Hard)...</span>
        </div>
      ) : assessmentResult ? (
        /* Results View */
        <div className="p-6 bg-slate-900/90 border border-emerald-500/40 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg glow-teal">
                <Award className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-mono uppercase font-bold">Assessment Complete</span>
                <h2 className="text-2xl font-black text-slate-100">Official Score: {assessmentResult.score}%</h2>
                <p className="text-xs text-slate-400">
                  {assessmentResult.correctCount} / 50 Correct • Accuracy: {((assessmentResult.correctCount / 50) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <button
              onClick={() => loadQuestions(selectedTopic)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Easy (15 Questions)</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {assessmentResult.breakdown?.easy || 0} / 15
              </span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Medium (25 Questions)</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {assessmentResult.breakdown?.medium || 0} / 25
              </span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Hard (10 Questions)</span>
              <span className="text-lg font-bold text-rose-400 font-mono">
                {assessmentResult.breakdown?.hard || 0} / 10
              </span>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Comprehensive Answer Key & Explanations (All 50 Questions):
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-500/30' 
                        : 'bg-red-950/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-200">
                        #{idx + 1}. {q.question}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-slate-400">
                        Your answer: <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}` : 'Unanswered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-400 font-bold">
                          Correct answer: {String.fromCharCode(65 + q.correctAnswer)}) {q.options[q.correctAnswer]}
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <strong className="text-cyan-400">Explanation: </strong>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Quiz Runner */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Question area (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
            
            {/* Question meta header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono font-bold text-xs">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  currentQ.difficulty === 'Easy' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : currentQ.difficulty === 'Medium' 
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {currentQ.difficulty || 'Medium'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQ.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                  flagged[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Title & Code snippet if any */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-100 leading-relaxed">
                {currentQ.question}
              </h3>
              {currentQ.codeSnippet && (
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  {currentQ.codeSnippet}
                </pre>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((optText, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 text-xs ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 text-slate-100 ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                      isSelected 
                        ? 'bg-cyan-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {letter}
                    </div>
                    <span className="leading-snug">{optText}</span>
                  </div>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-md glow-teal"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit (50/50)</span>
                </button>
              </div>

              <button
                type="button"
                disabled={currentQIndex >= questions.length - 1}
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 disabled:opacity-30"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right: 1-to-50 Question Navigator Grid (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Question Tracker (50 MCQs)
              </h4>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {answeredCount}/50 answered
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                <span>Current Question</span>
              </div>
            </div>

            {/* 1 to 50 Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 max-h-80 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
                const isFlagged = !!flagged[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center relative ${
                      isCurrent
                        ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-500/40 shadow-sm'
                        : isFlagged
                        ? 'bg-amber-500 text-slate-950'
                        : isAnswered
                        ? 'bg-emerald-600/80 text-white hover:bg-emerald-500'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-center">
              Per requirements: incomplete attempts do not change your score.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-8 h-8 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Unable to load questions for this topic</h3>
          <p className="text-xs text-slate-400">Click below to fetch the 50 calibrated MCQs.</p>
          <button
            onClick={() => loadQuestions(selectedTopic)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            Retry Loading Questions
          </button>
        </div>
      )}

    </div>
  );
}
