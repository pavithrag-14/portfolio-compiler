import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  name: { type: String, default: '' },
  studentName: { type: String, default: '' },
  issuer: { type: String, default: '' },
  certificateId: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  courseName: { type: String, default: '' },
  duration: { type: String, default: '' },
  score: { type: String, default: '' },
  scoreGrade: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  verificationUrl: { type: String, default: '' },
  qrCodeData: { type: String, default: '' },
  filePath: { type: String, default: null },
  fileName: { type: String, default: null },
  status: { type: String, default: 'Pending Verification' },
  verificationStatus: { type: String, default: 'Pending Verification' },
  verificationEvidence: { type: String, default: null },
  skillsVerified: [{ type: String }],
  uploadedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'certifications'
});

export const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);
