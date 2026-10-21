import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Programming' },
  proficiency: { type: Number, default: 75 },
  source: { type: String, default: 'manual' },
  verified: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'skills'
});

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
