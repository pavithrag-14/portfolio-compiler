import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  isPublic: { type: Boolean, default: true },
  visibility: { type: String, default: 'public' },
  template: { type: String, default: 'bento' },
  theme: { type: String, default: 'cyber-dark' },
  customHeadline: { type: String, default: '' },
  customAbout: { type: String, default: '' },
  visibleSections: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    coding: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    assessments: { type: Boolean, default: true },
    careerReadiness: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },
  sectionVisibility: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    coding: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    assessments: { type: Boolean, default: true },
    careerReadiness: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },
  projectOrder: [{ type: String }],
  skillOrder: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'portfolios'
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
