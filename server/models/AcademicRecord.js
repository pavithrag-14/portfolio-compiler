import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, default: '' },
  name: { type: String, default: '' },
  credits: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  gradePoint: { type: Number, default: 0 },
  status: { type: String, default: 'PASS' }
}, { _id: false });

const marksheetSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  semester: { type: String, required: true },
  fileName: { type: String, default: '' },
  filePath: { type: String, default: '' },
  documentPath: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Verified' },
  isVerified: { type: Boolean, default: true },
  extractedData: {
    studentName: { type: String, default: '' },
    registerNumber: { type: String, default: '' },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    department: { type: String, default: '' },
    semester: { type: String, default: '' },
    sgpa: { type: Number, default: null },
    cgpa: { type: Number, default: null },
    totalCredits: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },
    passFailStatus: { type: String, default: 'PASS' },
    subjects: [subjectSchema]
  }
}, { _id: false });

const academicRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  status: { type: String, default: 'Not Started' },
  sem1Status: { type: String, default: 'Not Uploaded' },
  calculatedCgpa: { type: Number, default: null },
  documentCgpa: { type: Number, default: null },
  hasDiscrepancy: { type: Boolean, default: false },
  discrepancyDelta: { type: Number, default: 0 },
  discrepancyNote: { type: String, default: null },
  verifiedDate: { type: Date, default: null },
  marksheets: [marksheetSchema]
}, {
  timestamps: true,
  collection: 'academicRecords'
});

export const AcademicRecord = mongoose.models.AcademicRecord || mongoose.model('AcademicRecord', academicRecordSchema);
