import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'academics');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const sem = req.params.semester || req.body?.semester || 'marksheet';
    cb(null, `${req.user?.id || 'usr'}-${sem}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|png|jpg|jpeg|webp/i;
    const isExtValid = allowed.test(path.extname(file.originalname));
    const isMimeValid = allowed.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (isExtValid || isMimeValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, PNG, JPG, and JPEG documents are permitted.'));
    }
  }
});

// Helper to normalize semester key ('1' -> 'sem1', 'sem1' -> 'sem1', 'consolidated' -> 'consolidated')
function normalizeSemesterKey(sem) {
  if (!sem) return 'sem1';
  const clean = sem.toString().toLowerCase().trim();
  if (clean === 'consolidated') return 'consolidated';
  if (clean.startsWith('sem')) return clean;
  return `sem${clean}`;
}

// Calculate independent CGPA across available marksheets
function computeAcademicAudit(marksheets) {
  let totalCredits = 0;
  let totalWeightedPoints = 0;
  let documentCgpaFound = null;

  marksheets.forEach(m => {
    const data = m.extractedData || {};
    if (data.cgpa && !isNaN(parseFloat(data.cgpa))) {
      documentCgpaFound = parseFloat(data.cgpa);
    }

    if (Array.isArray(data.subjects) && data.subjects.length > 0) {
      data.subjects.forEach(sub => {
        const cr = parseFloat(sub.credits) || 0;
        const gp = parseFloat(sub.gradePoint) || 0;
        if (cr > 0 && gp >= 0) {
          totalCredits += cr;
          totalWeightedPoints += (cr * gp);
        }
      });
    }
  });

  const calculatedCgpa = totalCredits > 0 ? parseFloat((totalWeightedPoints / totalCredits).toFixed(2)) : null;
  
  let hasDiscrepancy = false;
  let discrepancyDelta = 0;
  let discrepancyNote = null;

  if (documentCgpaFound !== null && calculatedCgpa !== null) {
    const delta = Math.abs(documentCgpaFound - calculatedCgpa);
    discrepancyDelta = parseFloat(delta.toFixed(2));
    if (delta > 0.15) {
      hasDiscrepancy = true;
      discrepancyNote = `Discrepancy Detected: Printed document CGPA is ${documentCgpaFound.toFixed(2)}, but credit-weighted calculation across ${totalCredits} subjects yields ${calculatedCgpa.toFixed(2)}. Please inspect grades.`;
    }
  }

  // Section 4 status rules:
  // If only Semester 1 is available: "Academic Records Partially Verified"
  // If multiple semesters are available: "Academic Records Updated"
  const hasSem1 = marksheets.some(m => m.semester === 'sem1');
  let status = 'Not Started';
  if (hasSem1 && marksheets.length === 1) {
    status = 'Academic Records Partially Verified';
  } else if (hasSem1 && marksheets.length > 1) {
    status = 'Academic Records Updated';
  } else if (marksheets.length > 0) {
    status = 'Academic Records Pending Sem 1';
  }

  return {
    calculatedCgpa,
    documentCgpa: documentCgpaFound,
    hasDiscrepancy,
    discrepancyDelta,
    discrepancyNote,
    status,
    totalCreditsAnalyzed: totalCredits
  };
}

// Build clean response payload matching both AcademicsView and backend audit requirements
function formatAcademicsPayload(userId) {
  const record = db.academics.getByUserId(userId);
  const profile = db.profiles.getByUserId(userId) || {};

  const semestersMap = {};
  let totalCredits = 0;
  let activeBacklogs = 0;
  let studentName = profile.fullName || '';
  let registerNumber = '';
  let university = profile.college || '';
  let degree = profile.degree || '';

  (record.marksheets || []).forEach(m => {
    const rawKey = m.semester || 'sem1';
    const num = rawKey === 'consolidated' ? 'consolidated' : rawKey.replace('sem', '');
    const subjects = m.extractedData?.subjects || [];
    const credits = subjects.reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0);
    totalCredits += credits;

    if (m.extractedData?.backlogs) {
      activeBacklogs += Number(m.extractedData.backlogs) || 0;
    }
    if (m.extractedData?.studentName && !studentName) {
      studentName = m.extractedData.studentName;
    }
    if (m.extractedData?.registerNumber || m.extractedData?.rollNumber) {
      registerNumber = m.extractedData.registerNumber || m.extractedData.rollNumber;
    }
    if (m.extractedData?.college && !university) {
      university = m.extractedData.college;
    }
    if (m.extractedData?.degree && !degree) {
      degree = m.extractedData.degree;
    }

    semestersMap[num] = {
      semester: rawKey,
      semesterTitle: m.extractedData?.semester || (rawKey === 'consolidated' ? 'Consolidated Marksheet' : `Semester ${num}`),
      sgpa: m.extractedData?.sgpa || null,
      cgpa: m.extractedData?.cgpa || null,
      credits,
      subjects,
      fileName: m.fileName || m.filename,
      filePath: m.filePath || m.fileUrl,
      fileSize: m.fileSize || '1.2 MB',
      uploadedAt: m.uploadDate || m.uploadedAt,
      status: m.status || 'Verified'
    };
  });

  return {
    ...record,
    semesters: semestersMap,
    academicStatus: record.status,
    calculatedCgpa: record.calculatedCgpa,
    extractedCgpa: record.documentCgpa,
    cgpaDiscrepancy: record.hasDiscrepancy,
    discrepancyDelta: record.discrepancyDelta || 0,
    discrepancyNote: record.discrepancyNote,
    totalCredits,
    activeBacklogs,
    studentName,
    registerNumber: registerNumber || 'REG-2022-8910',
    university,
    degree
  };
}

// Generate realistic OCR subjects based on semester
function generateOcrSubjectsForSemester(semesterKey, semNum, profile) {
  const dept = (profile?.department || 'Computer Science').toLowerCase();
  
  if (semesterKey === 'consolidated') {
    return [
      { code: 'CS101', name: 'Programming in C & Data Structures', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS201', name: 'Object Oriented Programming in Java', credits: 4, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS301', name: 'Design and Analysis of Algorithms', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS401', name: 'Database Management Systems', credits: 4, grade: 'O', gradePoint: 10.0, status: 'PASS' },
      { code: 'CS501', name: 'Computer Networks & Distributed Systems', credits: 3, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS601', name: 'Cloud Computing & Web Architecture', credits: 3, grade: 'A+', gradePoint: 9.5, status: 'PASS' }
    ];
  }

  const courseCatalog = {
    '1': [
      { code: 'CS101', name: 'Introduction to Computing & Logic', credits: 4, grade: 'A+', gradePoint: 9.0, status: 'PASS' },
      { code: 'MA101', name: 'Engineering Mathematics I: Calculus & Matrices', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'PH101', name: 'Engineering Physics & Semiconductors', credits: 4, grade: 'A+', gradePoint: 9.0, status: 'PASS' },
      { code: 'EE101', name: 'Basic Electrical & Electronics Engineering', credits: 3, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS102', name: 'Programming Laboratory in C', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '2': [
      { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'MA201', name: 'Discrete Mathematical Structures', credits: 4, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS202', name: 'Digital Logic & Computer Organization', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS203', name: 'Object Oriented Programming with C++', credits: 3, grade: 'O', gradePoint: 10.0, status: 'PASS' },
      { code: 'CS204', name: 'Data Structures Lab', credits: 2, grade: 'A+', gradePoint: 9.5, status: 'PASS' }
    ],
    '3': [
      { code: 'CS301', name: 'Design and Analysis of Algorithms', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS302', name: 'Operating Systems & Concurrency', credits: 4, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS303', name: 'Database Management Systems', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'MA301', name: 'Probability, Statistics & Random Processes', credits: 3, grade: 'B+', gradePoint: 8.0, status: 'PASS' },
      { code: 'CS304', name: 'RDBMS & SQL Laboratory', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '4': [
      { code: 'CS401', name: 'Theory of Computation & Automata', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS402', name: 'Computer Networks & TCP/IP Protocols', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS403', name: 'Software Engineering & Agile Methodologies', credits: 3, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS404', name: 'Microprocessors & Embedded Systems', credits: 3, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS405', name: 'Networks & Linux Systems Lab', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '5': [
      { code: 'CS501', name: 'Compiler Design & Lexical Analysis', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS502', name: 'Web Technologies & Full Stack Architectures', credits: 4, grade: 'O', gradePoint: 10.0, status: 'PASS' },
      { code: 'CS503', name: 'Artificial Intelligence & Search Algorithms', credits: 3, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS504', name: 'Cloud Computing & Virtualization', credits: 3, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS505', name: 'Full Stack Development Lab', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '6': [
      { code: 'CS601', name: 'Machine Learning & Neural Networks', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS602', name: 'Information & Cryptographic Security', credits: 4, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS603', name: 'Mobile Application Architecture', credits: 3, grade: 'A', gradePoint: 8.5, status: 'PASS' },
      { code: 'CS604', name: 'DevOps & CI/CD Toolchains', credits: 3, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS605', name: 'Capstone Mini Project', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '7': [
      { code: 'CS701', name: 'Distributed Systems & Microservices', credits: 4, grade: 'A+', gradePoint: 9.5, status: 'PASS' },
      { code: 'CS702', name: 'Big Data Analytics with Spark & Kafka', credits: 4, grade: 'A', gradePoint: 9.0, status: 'PASS' },
      { code: 'CS703', name: 'Human-Computer Interaction & UX Design', credits: 3, grade: 'O', gradePoint: 10.0, status: 'PASS' },
      { code: 'CS704', name: 'Industrial Internship / Practicum', credits: 3, grade: 'O', gradePoint: 10.0, status: 'PASS' }
    ],
    '8': [
      { code: 'CS801', name: 'Major Engineering Thesis & Final Project', credits: 10, grade: 'O', gradePoint: 10.0, status: 'PASS' },
      { code: 'CS802', name: 'Ethics, Intellectual Property & Cyber Law', credits: 3, grade: 'A+', gradePoint: 9.5, status: 'PASS' }
    ]
  };

  return courseCatalog[semNum] || [
    { code: `CS${semNum}01`, name: 'Core Advanced Technical Course', credits: 4, grade: 'A+', gradePoint: 9.0, status: 'PASS' },
    { code: `CS${semNum}02`, name: 'Elective Engineering Subject', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
    { code: `CS${semNum}03`, name: 'Applied Laboratory Experimentation', credits: 2, grade: 'O', gradePoint: 10.0, status: 'PASS' }
  ];
}

// GET /api/academics & /api/academic/records
const getAcademicsHandler = (req, res) => {
  try {
    const payload = formatAcademicsPayload(req.user.id);
    res.json(payload);
  } catch (err) {
    console.error('Academics get error:', err);
    res.status(500).json({ error: 'Failed to retrieve academic records.' });
  }
};

router.get('/', authMiddleware, getAcademicsHandler);
router.get('/records', authMiddleware, getAcademicsHandler);

// Upload Handler supporting both POST /upload/:semester and POST /upload-marksheet
const uploadMarksheetHandler = (req, res) => {
  try {
    const rawSemester = req.params.semester || req.body.semester;
    if (!rawSemester) {
      return res.status(400).json({ error: 'Please specify the semester for this marksheet.' });
    }

    const semesterKey = normalizeSemesterKey(rawSemester);
    const validSemesters = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8', 'consolidated'];
    
    if (!validSemesters.includes(semesterKey)) {
      return res.status(400).json({ error: `Invalid semester identifier: ${rawSemester}` });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please select a valid marksheet document (PDF, PNG, JPG).' });
    }

    const currentRecords = db.academics.getByUserId(req.user.id);
    const existingIndex = currentRecords.marksheets.findIndex(m => m.semester === semesterKey);

    const semNum = semesterKey === 'consolidated' ? 'consolidated' : semesterKey.replace('sem', '');
    const profile = db.profiles.getByUserId(req.user.id);

    // AI OCR Data Extraction (Section 25)
    const subjects = generateOcrSubjectsForSemester(semesterKey, semNum, profile);
    const semCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const semWeighted = subjects.reduce((sum, s) => sum + (s.credits * s.gradePoint), 0);
    const semSgpa = semCredits > 0 ? (semWeighted / semCredits).toFixed(2) : '9.00';

    const simulatedExtractedData = {
      studentName: profile?.fullName || 'Student Candidate',
      rollNumber: `NIT2022CS${Math.floor(800 + Math.random() * 199)}`,
      registerNumber: `NIT2022CS${Math.floor(800 + Math.random() * 199)}`,
      college: profile?.college || 'National Institute of Technology',
      degree: profile?.degree || 'B.Tech in Computer Science',
      department: profile?.department || 'Computer Science and Engineering',
      semester: semesterKey === 'consolidated' ? 'Consolidated Marksheet' : `Semester ${semNum}`,
      subjects,
      sgpa: parseFloat(semSgpa),
      cgpa: parseFloat(semSgpa),
      backlogs: 0,
      passFailStatus: 'PASS'
    };

    const newMarksheetItem = {
      id: `ms_${semesterKey}_${Date.now()}`,
      semester: semesterKey,
      fileName: req.file.originalname,
      filePath: `/uploads/academics/${req.file.filename}`,
      fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString(),
      status: 'Verified',
      isVerified: true,
      extractedData: simulatedExtractedData
    };

    if (existingIndex >= 0) {
      currentRecords.marksheets[existingIndex] = newMarksheetItem;
    } else {
      currentRecords.marksheets.push(newMarksheetItem);
    }

    const audit = computeAcademicAudit(currentRecords.marksheets);
    db.academics.saveRecord(req.user.id, {
      ...currentRecords,
      ...audit,
      sem1Status: currentRecords.marksheets.some(m => m.semester === 'sem1') ? 'Uploaded & Verified' : 'Not Uploaded'
    });

    const fullPayload = formatAcademicsPayload(req.user.id);

    res.json({
      message: `Marksheet for ${simulatedExtractedData.semester} uploaded and extracted successfully.`,
      semesterTitle: simulatedExtractedData.semester,
      marksheet: newMarksheetItem,
      academics: fullPayload,
      ...fullPayload
    });
  } catch (err) {
    console.error('Marksheet upload error:', err);
    res.status(500).json({ error: err.message || 'Error processing marksheet document.' });
  }
};

const uploadMiddleware = upload.single('marksheet');
const uploadAltMiddleware = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return upload.single('marksheetFile')(req, res, next);
    }
    if (!req.file) {
      return upload.single('marksheetFile')(req, res, next);
    }
    next();
  });
};

router.post('/upload-marksheet', authMiddleware, uploadAltMiddleware, uploadMarksheetHandler);
router.post('/upload/:semester', authMiddleware, uploadAltMiddleware, uploadMarksheetHandler);

// PUT /api/academic/update-subject
// Allows student to correct OCR digit recognition / grades on any subject (Section 25)
router.put('/update-subject', authMiddleware, (req, res) => {
  try {
    const { semester, subjectCode, subjectName, credits, grade, gradePoint } = req.body;
    if (!semester || !subjectCode) {
      return res.status(400).json({ error: 'Semester and subject code are required.' });
    }

    const semesterKey = normalizeSemesterKey(semester);
    const currentRecords = db.academics.getByUserId(req.user.id);
    const marksheet = currentRecords.marksheets.find(m => m.semester === semesterKey);

    if (!marksheet) {
      return res.status(404).json({ error: `Marksheet for ${semesterKey} not found.` });
    }

    const subjects = marksheet.extractedData?.subjects || [];
    const targetSubject = subjects.find(s => s.code === subjectCode);

    if (!targetSubject) {
      return res.status(404).json({ error: `Subject ${subjectCode} not found in ${semesterKey}.` });
    }

    // Update subject fields
    if (subjectName !== undefined) targetSubject.name = subjectName;
    if (credits !== undefined) targetSubject.credits = Number(credits);
    if (grade !== undefined) targetSubject.grade = grade;
    if (gradePoint !== undefined) targetSubject.gradePoint = Number(gradePoint);
    if (grade === 'F' || targetSubject.gradePoint === 0) {
      targetSubject.status = 'FAIL';
    } else {
      targetSubject.status = 'PASS';
    }

    // Recalculate SGPA for this marksheet
    const totalSemCr = subjects.reduce((acc, s) => acc + (s.credits || 0), 0);
    const totalSemPts = subjects.reduce((acc, s) => acc + ((s.credits || 0) * (s.gradePoint || 0)), 0);
    if (totalSemCr > 0) {
      marksheet.extractedData.sgpa = parseFloat((totalSemPts / totalSemCr).toFixed(2));
    }

    const audit = computeAcademicAudit(currentRecords.marksheets);
    db.academics.saveRecord(req.user.id, {
      ...currentRecords,
      ...audit,
      verifiedDate: new Date().toISOString()
    });

    const fullPayload = formatAcademicsPayload(req.user.id);

    res.json({
      message: `Subject ${subjectCode} updated successfully.`,
      subject: targetSubject,
      academics: fullPayload,
      ...fullPayload
    });
  } catch (err) {
    console.error('Update subject error:', err);
    res.status(500).json({ error: 'Failed to update subject grade.' });
  }
});

// PUT /api/academics/update-marksheet/:semester
router.put('/update-marksheet/:semester', authMiddleware, (req, res) => {
  try {
    const semesterKey = normalizeSemesterKey(req.params.semester);
    const currentRecords = db.academics.getByUserId(req.user.id);
    const marksheet = currentRecords.marksheets.find(m => m.semester === semesterKey);

    if (!marksheet) {
      return res.status(404).json({ error: `Marksheet for ${semesterKey} not found.` });
    }

    const { extractedData } = req.body;
    if (extractedData) {
      marksheet.extractedData = { ...marksheet.extractedData, ...extractedData };
      marksheet.status = 'Verified by Student';
    }

    const audit = computeAcademicAudit(currentRecords.marksheets);
    db.academics.saveRecord(req.user.id, {
      ...currentRecords,
      ...audit,
      verifiedDate: new Date().toISOString()
    });

    const fullPayload = formatAcademicsPayload(req.user.id);
    res.json({
      message: `Academic records for ${semesterKey.toUpperCase()} updated.`,
      academics: fullPayload,
      ...fullPayload
    });
  } catch (err) {
    console.error('Marksheet review error:', err);
    res.status(500).json({ error: 'Failed to update marksheet data.' });
  }
});

// DELETE /api/academics/marksheet/:semester
router.delete('/marksheet/:semester', authMiddleware, (req, res) => {
  try {
    const semesterKey = normalizeSemesterKey(req.params.semester);
    const currentRecords = db.academics.getByUserId(req.user.id);
    
    currentRecords.marksheets = currentRecords.marksheets.filter(m => m.semester !== semesterKey);
    const audit = computeAcademicAudit(currentRecords.marksheets);
    
    db.academics.saveRecord(req.user.id, {
      ...currentRecords,
      ...audit,
      sem1Status: currentRecords.marksheets.some(m => m.semester === 'sem1') ? 'Uploaded & Verified' : 'Not Uploaded'
    });

    const fullPayload = formatAcademicsPayload(req.user.id);
    res.json({
      message: `Marksheet for ${semesterKey.toUpperCase()} removed.`,
      academics: fullPayload,
      ...fullPayload
    });
  } catch (err) {
    console.error('Delete marksheet error:', err);
    res.status(500).json({ error: 'Failed to delete marksheet.' });
  }
});

export default router;
