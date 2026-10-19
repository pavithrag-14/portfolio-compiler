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
  RotateCcw,
  ArrowLeft
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

export default function AssessmentsView({ onDataChanged, onNavigate }) {
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
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                Calibrated 50-Question Assessments
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                15 Easy • 25 Medium • 10 Hard MCQs
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Topic Assessments & Cognitive Verification
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Strict 50-question assessments. Incomplete attempts do not alter scores. All 50 questions must be completed and submitted to calculate final accuracy and update the Skill Gap Engine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            {onNavigate && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('interview')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Next: AI Mock Interview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center px-3 border-r border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Timer</span>
                <span className="text-xl font-black text-blue-700 font-mono flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-600" />
                  {formatTimer(secondsElapsed)}
                </span>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Progress</span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  {answeredCount} / {questions.length || 50}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.id;
            const attempt = attempts.find(a => a.topicId === t.id && a.isCompleted);

            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{t.name}</span>
                {attempt && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {attempt.score}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {saveDraftMessage && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center space-x-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">{saveDraftMessage}</span>
          </div>
        )}
      </div>

      {/* Unanswered Blocked Submission Alert Banner */}
      {unansweredBlockedList && unansweredBlockedList.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2 text-sm font-bold text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Submission Blocked: {unansweredBlockedList.length} Questions Remain Unanswered!</span>
          </div>
          <p className="text-rose-700 leading-relaxed">
            Per system integrity requirements, a 50-Question topic assessment requires all 50 questions to be answered before computing verified competency scores.
          </p>
          <div className="pt-1">
            <span className="font-semibold text-rose-900 block mb-1">Click to jump to missing question:</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {unansweredBlockedList.map((qNum) => (
                <button
                  key={qNum}
                  onClick={() => {
                    setCurrentQIndex(qNum - 1);
                    setUnansweredBlockedList(null);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 font-mono font-bold text-[11px] border border-rose-300 cursor-pointer"
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
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Synthesizing 50 calibrated MCQs (15 Easy, 25 Medium, 10 Hard)...</span>
        </div>
      ) : assessmentResult ? (
        /* Results View */
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs text-emerald-700 font-mono uppercase font-bold">Assessment Complete</span>
                <h2 className="text-2xl font-black text-slate-900">Official Score: {assessmentResult.score}%</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {assessmentResult.correctCount} / 50 Correct • Accuracy: {((assessmentResult.correctCount / 50) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => loadQuestions(selectedTopic)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Retake</span>
              </button>
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('interview')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                  >
                    <span>Proceed to Step 9: AI Mock Interview</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium">Easy (15 Questions)</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">
                {assessmentResult.breakdown?.easy || 0} / 15
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium">Medium (25 Questions)</span>
              <span className="text-lg font-bold text-amber-700 font-mono">
                {assessmentResult.breakdown?.medium || 0} / 25
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium">Hard (10 Questions)</span>
              <span className="text-lg font-bold text-rose-700 font-mono">
                {assessmentResult.breakdown?.hard || 0} / 10
              </span>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Comprehensive Answer Key & Explanations (All 50 Questions):
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 bg-white ${
                      isCorrect 
                        ? 'border-emerald-200 shadow-2xs' 
                        : 'border-rose-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        #{idx + 1}. {q.question}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-slate-600">
                        Your answer: <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}` : 'Unanswered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-700 font-bold">
                          Correct answer: {String.fromCharCode(65 + q.correctAnswer)}) {q.options[q.correctAnswer]}
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                        <strong className="text-blue-700">Explanation: </strong>
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
          <div className="lg:col-span-8 p-6 bg-white border border-slate-200/90 rounded-2xl space-y-5 shadow-xs">
            
            {/* Question meta header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-xs">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  currentQ.difficulty === 'Easy' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : currentQ.difficulty === 'Medium' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {currentQ.difficulty || 'Medium'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQ.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                  flagged[currentQ.id]
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Title & Code snippet if any */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
              {currentQ.codeSnippet && (
                <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-100 overflow-x-auto shadow-2xs">
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
                        ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-medium ring-1 ring-blue-500/10 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {letter}
                    </div>
                    <span className="leading-snug">{optText}</span>
                  </div>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 disabled:opacity-40 border border-slate-200 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5 text-blue-600" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit (50/50)</span>
                </button>
              </div>

              <button
                type="button"
                disabled={currentQIndex >= questions.length - 1}
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 disabled:opacity-40 border border-slate-200 cursor-pointer shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right: 1-to-50 Question Navigator Grid (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-white border border-slate-200/90 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Tracker (50 MCQs)
              </h4>
              <span className="text-[11px] font-mono text-blue-700 font-bold">
                {answeredCount}/50 answered
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                <span>Current</span>
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
                    className={`h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center relative cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-200 shadow-xs'
                        : isFlagged
                        ? 'bg-amber-500 text-white'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
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
        <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Unable to load questions for this topic</h3>
          <p className="text-xs text-slate-500">Click below to fetch the 50 calibrated MCQs.</p>
          <button
            onClick={() => loadQuestions(selectedTopic)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
          >
            Retry Loading Questions
          </button>
        </div>
      )}

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 8 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Ready for acoustic speech & architecture interview?</h4>
          <p className="text-xs text-slate-600">Proceed to Step 9 to evaluate your spoken clarity, words per minute, and project explanations.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('interview')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 9: AI Mock Interview</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
