import express from 'express';
import { db } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../auth.js';
import { TARGET_ROLE_DEFINITIONS } from '../data/mcqBank.js';

const router = express.Router();

// Question generation handler
const generateQuestionsHandler = (req, res) => {
  try {
    const userId = req.user?.id || 'usr_neshat_demo';
    const profile = db.profiles.getByUserId(userId);
    const targetRoleId = profile?.targetRoleId || 'fullstack-developer';
    const roleDef = TARGET_ROLE_DEFINITIONS.find(r => r.id === targetRoleId) || TARGET_ROLE_DEFINITIONS[0];

    const studentProjects = db.projects.getByUserId(userId);
    const studentSkills = db.skills.getByUserId(userId);

    const primaryProject = studentProjects.length > 0 ? studentProjects[0] : null;

    const questions = [];

    // 1. Technical Domain Question
    if (targetRoleId.includes('data') || targetRoleId.includes('ml')) {
      questions.push({
        id: 1,
        category: 'Technical',
        text: "How do you systematically detect and handle high multicollinearity among features before training high-dimensional models?",
        projectReference: null,
        expectedKeywords: ['vif', 'variance inflation factor', 'correlation matrix', 'pca', 'ridge', 'lasso', 'regularization']
      });
    } else if (targetRoleId.includes('ui-ux')) {
      questions.push({
        id: 1,
        category: 'Technical',
        text: "How do you conduct usability testing for a complex workflow, and what quantitative metrics do you measure to validate decisions?",
        projectReference: null,
        expectedKeywords: ['sus', 'task completion rate', 'time on task', 'think aloud', 'heuristics', 'error rate']
      });
    } else {
      questions.push({
        id: 1,
        category: 'Technical',
        text: "Explain how you optimize Core Web Vitals (specifically Largest Contentful Paint and CLS) when architecting a modern React application.",
        projectReference: null,
        expectedKeywords: ['lcp', 'cls', 'aspect ratio', 'skeleton', 'fetchpriority', 'critical css', 'lazy loading']
      });
    }

    // 2. Personalized Project-Based Question (Section 16: Question referencing actual student project)
    if (primaryProject) {
      questions.push({
        id: 2,
        category: 'Project-based',
        text: `In your project '${primaryProject.title}', what specific architectural tradeoffs did you encounter regarding ${primaryProject.technologies?.slice(0, 3).join(', ') || 'system design'}, and how did you resolve them?`,
        projectReference: primaryProject.title,
        expectedKeywords: ['architecture', 'tradeoff', 'performance', 'database', 'latency', 'solution']
      });
    } else {
      questions.push({
        id: 2,
        category: 'Project-based',
        text: "Walk me through an end-to-end technical project you built: what was the core problem statement, your system architecture, and the measurable outcome?",
        projectReference: null,
        expectedKeywords: ['problem', 'architecture', 'technology', 'scalability', 'outcome', 'metrics']
      });
    }

    // 3. Behavioral Question
    questions.push({
      id: 3,
      category: 'Behavioral',
      text: "Describe a situation where a technical requirement shifted late in a development cycle. How did you prioritize deliverables and communicate with stakeholders?",
      projectReference: null,
      expectedKeywords: ['prioritize', 'stakeholder', 'communication', 'agile', 'scope', 'mvp', 'risk']
    });

    // 4. Role-Specific Question
    questions.push({
      id: 4,
      category: 'Role-specific',
      text: `As an aspiring ${roleDef.title}, how do you balance rapid delivery of business features with long-term technical debt, code quality, and security considerations?`,
      projectReference: null,
      expectedKeywords: ['technical debt', 'refactoring', 'ci/cd', 'code review', 'testing', 'modular']
    });

    res.json({
      targetRole: roleDef.title,
      totalQuestions: questions.length,
      questions
    });
  } catch (err) {
    console.error('Interview start error:', err);
    res.status(500).json({ error: 'Failed to generate personalized mock interview.' });
  }
};

router.get('/', optionalAuthMiddleware, generateQuestionsHandler);
router.post('/', optionalAuthMiddleware, generateQuestionsHandler);
router.get('/questions', optionalAuthMiddleware, generateQuestionsHandler);
router.post('/start', optionalAuthMiddleware, generateQuestionsHandler);
router.get('/generate-questions', optionalAuthMiddleware, generateQuestionsHandler);
router.post('/generate-questions', optionalAuthMiddleware, generateQuestionsHandler);

// POST /api/interview/evaluate
// Evaluates candidate's written or acoustic speech input
router.post('/evaluate', optionalAuthMiddleware, (req, res) => {
  try {
    const { answer, question, questionIndex, durationSeconds, answers: answerList, targetRoleId } = req.body;
    
    if (answer || question) {
      const text = answer || '';
      const words = text.trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const duration = Math.max(5, durationSeconds || 15);
      const wpm = Math.round((wordCount / duration) * 60);

      const fillerRegex = /\b(um|uh|like|basically|actually|you know|sort of|kind of)\b/gi;
      const fillerMatches = text.match(fillerRegex);
      const fillerCount = fillerMatches ? fillerMatches.length : 0;

      const hasSubstance = wordCount >= 15;
      const score = Math.min(98, Math.max(50, (hasSubstance ? 75 : 55) + (fillerCount <= 2 ? 15 : 5) + Math.min(10, Math.floor(wordCount / 10))));

      const evaluation = {
        questionIndex: questionIndex || 0,
        score,
        wordsPerMinute: wpm,
        fillerWordCount: fillerCount,
        technicalDepth: wordCount >= 30 ? 'High' : 'Moderate',
        clarityScore: Math.max(60, 95 - fillerCount * 5),
        strengths: 'Clear engineering articulation with direct problem framing.',
        improvements: fillerCount > 2 ? `Reduce reliance on verbal pauses (${fillerCount} filler words detected).` : 'Elaborate more on architectural edge cases.'
      };

      // Also persist session evaluation into DB so dashboard & readiness index reflect it
      const userId = req.user?.id || 'usr_neshat_demo';
      const current = db.interviews.getLatestByUserId(userId);
      const updatedScores = {
        technical: Math.max(70, score),
        communication: Math.max(65, 95 - fillerCount * 5),
        problemSolving: Math.max(70, score - 2),
        projectKnowledge: Math.max(75, score + 4),
        overall: score
      };

      db.interviews.saveSession(userId, {
        targetRoleId: targetRoleId || 'fullstack-developer',
        answers: [{ question, text, durationSec: duration, score }],
        scores: updatedScores,
        feedback: {
          strengths: ['Clear terminology and problem framing.'],
          improvements: [fillerCount > 2 ? `${fillerCount} filler words detected.` : 'Elaborate more on quantitative outcomes.'],
          summary: `Candidate demonstrated solid core competency with overall score ${score}%.`
        },
        acousticMetrics: {
          paceWpm: wpm,
          fillerWords: fillerCount,
          durationSec: duration
        }
      });

      return res.json({ evaluation });
    }

    const answers = answerList || [];
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Interview answers are required for evaluation.' });
    }

    let totalTechnicalScore = 0;
    let totalCommunicationScore = 0;
    let totalProblemSolvingScore = 0;
    let totalProjectKnowledgeScore = 0;

    let aggregateFillerWords = 0;
    let totalWords = 0;
    let totalDurationSeconds = 0;

    const fillerRegex = /\b(um|uh|like|basically|actually|you know|sort of|kind of)\b/gi;

    answers.forEach((ans, idx) => {
      const text = ans.text || '';
      const words = text.trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;

      const fillerMatches = text.match(fillerRegex);
      const fillersCount = fillerMatches ? fillerMatches.length : 0;
      aggregateFillerWords += fillersCount;

      totalDurationSeconds += (ans.durationSec || Math.max(30, words.length * 0.4));

      const hasSubstance = words.length >= 35;
      const isDetailed = words.length >= 60;

      let qTech = hasSubstance ? (isDetailed ? 85 : 75) : 55;
      let qComm = fillersCount <= 2 ? 85 : Math.max(60, 85 - fillersCount * 4);
      let qProb = text.toLowerCase().includes('because') || text.toLowerCase().includes('tradeoff') || text.toLowerCase().includes('result') ? 84 : 70;
      let qProj = idx === 1 ? (hasSubstance ? 88 : 65) : 80;

      totalTechnicalScore += qTech;
      totalCommunicationScore += qComm;
      totalProblemSolvingScore += qProb;
      totalProjectKnowledgeScore += qProj;
    });

    const count = answers.length;
    const technical = Math.round(totalTechnicalScore / count);
    const communication = Math.round(totalCommunicationScore / count);
    const problemSolving = Math.round(totalProblemSolvingScore / count);
    const projectKnowledge = Math.round(totalProjectKnowledgeScore / count);
    const overall = Math.round((technical * 0.35) + (projectKnowledge * 0.25) + (problemSolving * 0.20) + (communication * 0.20));

    const minutes = Math.max(0.5, totalDurationSeconds / 60);
    const paceWpm = Math.round(totalWords / minutes);

    const feedback = {
      strengths: [
        'Articulated real technical concepts with relevant terminology.',
        projectKnowledge >= 80 ? 'Demonstrated strong ownership and architectural recall of project work.' : 'Clear structured responses.',
        paceWpm >= 120 && paceWpm <= 165 ? 'Optimal conversational pace adhering to professional presentation standards.' : 'Consistent delivery.'
      ],
      improvements: [
        aggregateFillerWords > 3 ? `Detected ${aggregateFillerWords} filler words. Aim to pause intentionally instead of using vocal fillers.` : 'Good conciseness.',
        technical < 80 ? 'Incorporate more specific architectural tradeoffs and framework metrics in technical questions.' : 'Deepen quantitative impact metrics.'
      ],
      summary: `Candidate demonstrated solid core readiness with an overall interview rating of ${overall}%. Strongest area was Project Knowledge (${projectKnowledge}%).`
    };

    const userId = req.user?.id || 'usr_neshat_demo';
    const session = db.interviews.saveSession(userId, {
      targetRoleId: targetRoleId || 'fullstack-developer',
      answers,
      scores: {
        technical,
        communication,
        problemSolving,
        projectKnowledge,
        overall
      },
      feedback,
      acousticMetrics: {
        paceWpm,
        fillerWords: aggregateFillerWords,
        durationSec: Math.round(totalDurationSeconds)
      }
    });

    res.json({
      message: 'AI Mock Interview evaluated successfully.',
      session
    });
  } catch (err) {
    console.error('Interview evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate interview responses.' });
  }
});

// GET /api/interview/latest & /session
const getLatestSessionHandler = (req, res) => {
  const userId = req.user?.id || 'usr_neshat_demo';
  const latest = db.interviews.getLatestByUserId(userId);
  res.json(latest || {
    scores: { technical: 75, communication: 75, problemSolving: 75, projectKnowledge: 80, overall: 76 },
    acousticMetrics: { paceWpm: 130, fillerWords: 1 }
  });
};

router.get('/latest', optionalAuthMiddleware, getLatestSessionHandler);
router.get('/session', optionalAuthMiddleware, getLatestSessionHandler);

export default router;
