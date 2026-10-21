import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  problemStatement: { type: String, default: '' },
  solution: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  role: { type: String, default: '' },
  roleContribution: { type: String, default: '' },
  teamSize: { type: String, default: '1' },
  githubUrl: { type: String, default: '' },
  repositoryUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  screenshots: [{ type: String }],
  outcome: { type: String, default: '' },
  outcomes: { type: String, default: '' },
  duration: { type: String, default: '' },
  isImportedFromGithub: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'projects'
});

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
