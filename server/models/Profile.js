import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  institution: { type: String, default: '' }, // College
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },     // Department
  department: { type: String, default: '' },
  year: { type: String, default: '' },       // Graduation year
  graduationYear: { type: String, default: '' },
  targetRole: { type: String, default: 'fullstack-developer' },
  targetRoleId: { type: String, default: 'fullstack-developer' },
  location: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  headline: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  avatarUrl: { type: String, default: '' }
}, {
  timestamps: true,
  collection: 'profiles'
});

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
