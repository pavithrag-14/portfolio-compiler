import express from 'express';
import { db } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../auth.js';
import { ALL_MCQ_BANKS, TOPICS, TARGET_ROLE_DEFINITIONS } from '../data/mcqBank.js';

const router = express.Router();

// GET /api/assessments/topics
// Returns topics associated with student's current target role, with attempt status
router.get('/topics', optionalAuthMiddleware, (req, res) => {
  const userId = req.user?.id || 'usr_neshat_demo';
  const profile = db.profiles.getByUserId(userId) || {};
  const targetRoleId = profile?.targetRoleId || 'fullstack-developer';
  const roleDef = TARGET_ROLE_DEFINITIONS.find(r => r.id === targetRoleId) || TARGET_ROLE_DEFINITIONS[0];

  const attempts = db.assessments.getByUserId(userId);

  // Map all topics, highlighting those relevant to target role
  const topicList = TOPICS.map(topic => {
    const isRecommendedForRole = (roleDef.topics || []).includes(topic.id);
    const attempt = attempts.find(a => a.topicId === topic.id);
    const answersCount = attempt ? Object.keys(attempt.answers || {}).length : 0;

    return {
      id: topic.id,
      name: topic.name,
      category: topic.category,
      description: topic.description,
      totalQuestions: 50,
      isRecommendedForRole,
      status: attempt ? attempt.status : 'Not Started',
      score: (attempt && attempt.status === 'Completed') ? attempt.score : null,
      scoreDisplay: (attempt && attempt.status === 'Completed') ? `${attempt.score}%` : 'Not Updated',
      answeredCount: answersCount,
      completedAt: attempt?.completedAt || null,
      historyCount: (attempt?.history || []).length
    };
  });

  res.json({
    targetRole: roleDef.title,
    topics: topicList
  });
});

// GET /api/assessments/attempts
// Returns historical attempts for student
router.get('/attempts', optionalAuthMiddleware, (req, res) => {
  const userId = req.user?.id || 'usr_neshat_demo';
  const attempts = db.assessments.getByUserId(userId);
  const formatted = attempts.map(a => ({
    id: a.id,
    topicId: a.topicId,
    status: a.status,
    isCompleted: a.status === 'Completed',
    score: a.score,
    correctCount: a.correctCount,
    incorrectCount: a.incorrectCount,
    completedAt: a.completedAt,
    history: a.history || []
  }));

  res.json({
    attempts: formatted
  });
});

// GET /api/assessments/:topicId/questions
// Returns all 50 questions (omits correctAnswer to prevent client-side inspection before submission)
router.get('/:topicId/questions', optionalAuthMiddleware, (req, res) => {
  const { topicId } = req.params;
  const bank = ALL_MCQ_BANKS[topicId];

  if (!bank || bank.length !== 50) {
    return res.status(404).json({ error: `Assessment topic '${topicId}' not found or question bank incomplete.` });
  }

  // Return questions with options and metadata, omitting correct answers
  const sanitizedQuestions = bank.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    topicName: q.topicName
  }));

  const userId = req.user?.id || 'usr_neshat_demo';
  const attempt = db.assessments.getAttempt(userId, topicId);

  res.json({
    topicId,
    totalQuestions: 50,
    questions: sanitizedQuestions,
    savedAnswers: attempt ? attempt.answers : {},
    status: attempt ? attempt.status : 'Not Started',
    score: (attempt && attempt.status === 'Completed') ? attempt.score : null
  });
});

// Save Progress Handler
const saveProgressHandler = (req, res) => {
  try {
    const topicId = req.params.topicId || req.body.topicId;
    const { answers } = req.body; // e.g. { "1": 2, "2": 0, ... }

    if (!topicId || !ALL_MCQ_BANKS[topicId]) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    const userId = req.user?.id || 'usr_neshat_demo';
    const savedAttempt = db.assessments.saveProgress(userId, topicId, answers);
    const answeredCount = Object.keys(savedAttempt.answers || {}).length;

    res.json({
      message: `Progress saved (${answeredCount}/50 answered).`,
      answeredCount,
      totalQuestions: 50,
      status: savedAttempt.status,
      score: savedAttempt.score // remains null or prior completed score
    });
  } catch (err) {
    console.error('Save progress error:', err);
    res.status(500).json({ error: 'Failed to save assessment progress.' });
  }
};

router.post('/:topicId/save-progress', optionalAuthMiddleware, saveProgressHandler);
router.post('/save-progress', optionalAuthMiddleware, saveProgressHandler);

// Submit Handler
const submitHandler = (req, res) => {
  try {
    const topicId = req.params.topicId || req.body.topicId;
    const bank = ALL_MCQ_BANKS[topicId];

    if (!topicId || !bank || bank.length !== 50) {
      return res.status(404).json({ error: 'Invalid assessment topic.' });
    }

    const userId = req.user?.id || 'usr_neshat_demo';
    // Retrieve full answers passed in body or merged with stored attempt
    const submittedAnswers = req.body.answers || {};
    const existingAttempt = db.assessments.getAttempt(userId, topicId);
    const allAnswers = { ...(existingAttempt?.answers || {}), ...submittedAnswers };

    // Check for unanswered questions (must be 1 to 50)
    const unanswered = [];
    for (let qId = 1; qId <= 50; qId++) {
      if (allAnswers[qId] === undefined || allAnswers[qId] === null) {
        unanswered.push(qId);
      }
    }

    // SECTION 14: If unanswered questions exist during submission: Block final submission, show unanswered question numbers
    if (unanswered.length > 0) {
      return res.status(400).json({
        error: `Incomplete Assessment: You have answered ${50 - unanswered.length}/50 questions. All 50 questions must be completed before final evaluation.`,
        unansweredCount: unanswered.length,
        unansweredQuestions: unanswered,
        answeredCount: 50 - unanswered.length,
        status: 'In Progress'
      });
    }

    // All 50 questions answered -> evaluate against master key
    let correctCount = 0;
    let incorrectCount = 0;
    const strengths = [];
    const weaknesses = [];

    const difficultyBreakdown = {
      Easy: { correct: 0, total: 15 },
      Medium: { correct: 0, total: 25 },
      Hard: { correct: 0, total: 10 }
    };

    bank.forEach(q => {
      const selected = allAnswers[q.id];
      if (selected === q.correctAnswer) {
        correctCount++;
        difficultyBreakdown[q.difficulty].correct++;
      } else {
        incorrectCount++;
        weaknesses.push(`Q${q.id} (${q.difficulty}): Review explanation: ${q.explanation}`);
      }
    });

    const scorePercentage = Math.round((correctCount / 50) * 100);

    let performanceLevel = 'Proficient';
    if (scorePercentage >= 90) performanceLevel = 'Expert / Top Tier';
    else if (scorePercentage >= 75) performanceLevel = 'Advanced Industry Ready';
    else if (scorePercentage >= 60) performanceLevel = 'Competent Foundation';
    else performanceLevel = 'Needs Fundamental Review';

    if (difficultyBreakdown.Easy.correct >= 13) strengths.push('Strong core concept mastery');
    if (difficultyBreakdown.Medium.correct >= 20) strengths.push('Robust applied implementation skills');
    if (difficultyBreakdown.Hard.correct >= 7) strengths.push('Excellent advanced algorithmic intuition');

    const evaluationResult = {
      score: scorePercentage,
      accuracy: scorePercentage,
      correctCount,
      incorrectCount,
      performanceLevel,
      strengths: strengths.length > 0 ? strengths : ['Basic recall operational'],
      weaknesses: weaknesses.slice(0, 5), // top 5 key review pointers
      difficultyBreakdown,
      answers: allAnswers
    };

    // Finalize attempt in DB
    const finalized = db.assessments.finalizeSubmission(userId, topicId, evaluationResult);

    // SECTION 15: Send result to Skill Gap Engine & update skill evidence!
    const topicObj = TOPICS.find(t => t.id === topicId);
    if (topicObj) {
      const existingSkill = db.skills.getByUserId(userId).find(s => s.name.toLowerCase() === topicObj.name.toLowerCase());
      if (existingSkill) {
        db.skills.update(existingSkill.id, {
          proficiency: Math.max(existingSkill.proficiency, scorePercentage),
          verified: scorePercentage >= 70,
          source: 'assessment'
        });
      } else {
        db.skills.add(userId, {
          name: topicObj.name,
          category: topicObj.category,
          proficiency: scorePercentage,
          source: 'assessment',
          verified: scorePercentage >= 70
        });
      }
    }

    res.json({
      message: `Assessment completed successfully! Score: ${scorePercentage}% (${correctCount}/50 correct).`,
      score: scorePercentage,
      accuracy: scorePercentage,
      correctCount,
      incorrectCount,
      performanceLevel,
      strengths: finalized.strengths,
      weaknesses: finalized.weaknesses,
      difficultyBreakdown,
      completedAt: finalized.completedAt,
      result: {
        topicId,
        topicName: topicObj?.name,
        totalQuestions: 50,
        correctCount,
        incorrectCount,
        score: scorePercentage,
        performanceLevel,
        strengths: finalized.strengths,
        weaknesses: finalized.weaknesses,
        difficultyBreakdown,
        completedAt: finalized.completedAt
      }
    });
  } catch (err) {
    console.error('Assessment evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate assessment submission.' });
  }
};

router.post('/:topicId/submit', optionalAuthMiddleware, submitHandler);
router.post('/submit', optionalAuthMiddleware, submitHandler);

// GET /api/assessments/:topicId/review
// Review full answers with explanations after completion
router.get('/:topicId/review', optionalAuthMiddleware, (req, res) => {
  const { topicId } = req.params;
  const userId = req.user?.id || 'usr_neshat_demo';
  const attempt = db.assessments.getAttempt(userId, topicId);

  if (!attempt || attempt.status !== 'Completed') {
    return res.status(403).json({ error: 'Detailed answers can only be reviewed after completing all 50 questions.' });
  }

  const bank = ALL_MCQ_BANKS[topicId] || [];
  const fullReview = bank.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    selectedOption: attempt.answers ? attempt.answers[q.id] : null,
    correctAnswer: q.correctAnswer,
    isCorrect: attempt.answers && attempt.answers[q.id] === q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation
  }));

  res.json({
    topicId,
    score: attempt.score,
    correctCount: attempt.correctCount,
    incorrectCount: attempt.incorrectCount,
    completedAt: attempt.completedAt,
    questions: fullReview
  });
});

export default router;
