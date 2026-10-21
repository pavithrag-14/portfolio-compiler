import mongoose from 'mongoose';

const attemptHistorySchema = new mongoose.Schema({
  attemptNumber: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 }
}, { _id: false });

const assessmentAttemptSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  topicId: { type: String, default: '' },
  domain: { type: String, default: '' },
  questionIds: [{ type: String }],
  attemptNumber: { type: Number, default: 1 },
  status: { type: String, default: 'In Progress' },
  answers: { type: Map, of: String, default: {} },
  score: { type: Number, default: null },
  correctCount: { type: Number, default: null },
  incorrectCount: { type: Number, default: null },
  totalCount: { type: Number, default: 50 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  history: [attemptHistorySchema],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  submittedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: 'assessmentAttempts'
});

export const AssessmentAttempt = mongoose.models.AssessmentAttempt || mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
