import mongoose from 'mongoose';

const careerReadinessSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  targetRoleId: { type: String, default: 'fullstack-developer' },
  targetRole: { type: String, default: 'Full Stack Developer' },
  criScore: { type: Number, default: 75 },
  readinessScore: { type: Number, default: 75 },
  componentScores: {
    academics: { type: Number, default: 80 },
    certifications: { type: Number, default: 70 },
    coding: { type: Number, default: 75 },
    projects: { type: Number, default: 80 },
    skills: { type: Number, default: 75 },
    assessments: { type: Number, default: 70 },
    interview: { type: Number, default: 78 }
  },
  skillGaps: [{
    skill: String,
    category: String,
    requiredLevel: Number,
    currentLevel: Number,
    gap: Number,
    status: String
  }],
  status: { type: String, default: 'Placement Ready' },
  calculatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'careerReadiness'
});

export const CareerReadiness = mongoose.models.CareerReadiness || mongoose.model('CareerReadiness', careerReadinessSchema);
