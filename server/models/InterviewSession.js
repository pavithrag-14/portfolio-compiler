import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  targetRoleId: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  questions: [{ type: String }],
  answers: [{ type: String }],
  responses: [{ type: String }],
  wpm: { type: Number, default: 140 },
  fillerCount: { type: Number, default: 2 },
  status: { type: String, default: 'Completed' },
  scores: {
    technical: { type: Number, default: 75 },
    communication: { type: Number, default: 80 },
    problemSolving: { type: Number, default: 78 },
    projectKnowledge: { type: Number, default: 82 },
    overall: { type: Number, default: 78 }
  },
  feedback: { type: mongoose.Schema.Types.Mixed, default: {} },
  acousticMetrics: {
    paceWpm: { type: Number, default: 140 },
    fillerWords: { type: Number, default: 2 },
    durationSec: { type: Number, default: 120 }
  },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'interviewSessions'
});

export const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);
