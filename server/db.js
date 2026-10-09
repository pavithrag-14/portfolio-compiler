import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const INITIAL_DB_STRUCTURE = {
  users: [],
  profiles: [],
  academics: [],
  certifications: [],
  codingProfiles: [],
  projects: [],
  skills: [],
  assessmentAttempts: [],
  interviewSessions: [],
  portfolios: []
};

// In-memory cache synced with disk
let dbData = { ...INITIAL_DB_STRUCTURE };

function seedDemoStudent() {
  const demoUserId = 'usr_neshat_demo';
  const passwordHash = bcrypt.hashSync('password123', 10);

  dbData.users.push({
    id: demoUserId,
    email: 'student@portfolio.ai',
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  dbData.profiles.push({
    userId: demoUserId,
    fullName: 'Neshat V.',
    email: 'student@portfolio.ai',
    phone: '+1 (555) 234-5678',
    college: 'National Institute of Technology',
    degree: 'B.Tech in Computer Science',
    department: 'Computer Science and Engineering',
    graduationYear: '2026',
    location: 'Bangalore, India',
    linkedinUrl: 'https://linkedin.com/in/neshat-demo',
    githubUrl: 'https://github.com/neshat-demo',
    headline: 'AI Portfolio Architect & Systems Engineer',
    aboutMe: 'Passionate about human-centered design systems, high-concurrency microservices, and cryptographic credential integrity.',
    targetRoleId: 'ui-ux-designer',
    avatarUrl: ''
  });

  dbData.academics.push({
    userId: demoUserId,
    status: 'Academic Records Partially Verified',
    calculatedCgpa: 8.85,
    documentCgpa: 8.85,
    hasDiscrepancy: false,
    discrepancyDelta: 0,
    marksheets: [
      {
        semester: 'sem1',
        filename: 'sem1_transcript_verified.pdf',
        fileUrl: '/uploads/academics/sem1_transcript_verified.pdf',
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        isVerified: true,
        extractedData: {
          studentName: 'Neshat V.',
          registerNumber: 'NIT2022CS891',
          college: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science',
          department: 'Computer Science and Engineering',
          semester: 'Semester 1',
          sgpa: 8.85,
          cgpa: 8.85,
          totalCredits: 22,
          backlogs: 0,
          passFailStatus: 'PASS',
          subjects: [
            { code: 'CS101', name: 'Introduction to Computing', credits: 4, grade: 'A+', gradePoint: 9, status: 'PASS' },
            { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A', gradePoint: 8.5, status: 'PASS' },
            { code: 'PH101', name: 'Engineering Physics', credits: 4, grade: 'A+', gradePoint: 9, status: 'PASS' },
            { code: 'EE101', name: 'Basic Electrical & Electronics', credits: 3, grade: 'A', gradePoint: 8.5, status: 'PASS' },
            { code: 'CS102', name: 'Programming Laboratory', credits: 2, grade: 'O', gradePoint: 10, status: 'PASS' }
          ]
        }
      }
    ]
  });

  dbData.certifications.push({
    id: 'cert_1',
    userId: demoUserId,
    title: 'Meta Front-End Developer Professional Certificate',
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Coursera / Meta',
    certificateId: 'COURSERA-META-7821',
    issueDate: '2024-03-15',
    score: '98%',
    credentialUrl: 'https://coursera.org/verify/META7821',
    status: 'Verified',
    skillsVerified: ['React', 'JavaScript', 'UI Architecture', 'Figma'],
    verificationEvidence: 'Cryptographically validated against Coursera public certificate registry.'
  });

  dbData.codingProfiles.push({
    userId: demoUserId,
    github: {
      connected: true,
      username: 'neshat-developer',
      publicRepos: 14,
      stars: 42,
      forks: 18,
      topLanguages: ['TypeScript', 'JavaScript', 'Python', 'CSS'],
      repositories: [
        { name: 'portfolio-compiler-engine', url: 'https://github.com/neshat/portfolio-compiler-engine', description: 'Autonomous student employability evaluation platform', language: 'JavaScript', stargazers_count: 24 },
        { name: 'neuro-synth-ui', url: 'https://github.com/neshat/neuro-synth-ui', description: 'Real-time telemetry dashboard with WebGL graphs', language: 'TypeScript', stargazers_count: 18 }
      ]
    },
    leetcode: {
      connected: true,
      username: 'neshat_coder',
      totalSolved: 240,
      easySolved: 110,
      mediumSolved: 105,
      hardSolved: 25,
      contestRating: 1840,
      ranking: 42100,
      acceptanceRate: '68.4%',
      badges: ['50 Days 2024', 'Top SQL 50', 'Graph Master']
    }
  });

  dbData.projects.push(
    {
      id: 'proj_1',
      userId: demoUserId,
      title: 'Autonomous Drone Flight Telemetry Controller',
      problemStatement: 'Latency spikes in manual drone ground stations cause packet drops during BVLOS flight.',
      solution: 'Engineered a WebSockets real-time dashboard with React and FastAPI achieving sub-30ms round-trip latency.',
      description: 'Engineered a WebSockets real-time dashboard with React and FastAPI achieving sub-30ms round-trip latency.',
      technologies: ['React', 'FastAPI', 'WebSockets', 'Python', 'Docker'],
      role: 'Full Stack & Telemetry Architect',
      teamSize: '2',
      githubUrl: 'https://github.com/neshat/drone-telemetry-controller',
      demoUrl: 'https://drone-telemetry-demo.vercel.app',
      duration: '4 months',
      outcome: 'Reduced telemetry latency by 45% with zero dropped frames across 100km simulated trials.'
    },
    {
      id: 'proj_2',
      userId: demoUserId,
      title: 'Decentralized Healthcare Record Vault',
      problemStatement: 'Siloed patient medical histories prevent fast emergency access across divergent hospitals.',
      solution: 'Built an encrypted health wallet leveraging AES-256 and client-side zero-knowledge proof verification.',
      description: 'Built an encrypted health wallet leveraging AES-256 and client-side zero-knowledge proof verification.',
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Cryptography'],
      role: 'Backend Security Engineer',
      teamSize: '3',
      githubUrl: 'https://github.com/neshat/health-record-vault',
      demoUrl: 'https://health-vault-demo.vercel.app',
      duration: '3 months',
      outcome: 'Validated cryptographic audit speed under 120ms with HIPPA compliance test suite.'
    }
  );

  dbData.skills.push(
    { id: 'sk_1', userId: demoUserId, name: 'User Research', category: 'UI/UX', proficiency: 85, verified: true, source: 'Project & Cert' },
    { id: 'sk_2', userId: demoUserId, name: 'Wireframing & Figma', category: 'UI/UX', proficiency: 92, verified: true, source: 'Cert' },
    { id: 'sk_3', userId: demoUserId, name: 'React & Frontend', category: 'Web Development', proficiency: 88, verified: true, source: 'GitHub Repos' },
    { id: 'sk_4', userId: demoUserId, name: 'Data Structures & Algorithms', category: 'Programming', proficiency: 82, verified: true, source: 'LeetCode' },
    { id: 'sk_5', userId: demoUserId, name: 'SQL & Database', category: 'Database', proficiency: 78, verified: true, source: 'Academic Transcript' },
    { id: 'sk_6', userId: demoUserId, name: 'Docker & Containerization', category: 'DevOps', proficiency: 75, verified: true, source: 'Projects' }
  );

  dbData.portfolios.push({
    userId: demoUserId,
    slug: 'neshat',
    isPublic: true,
    template: 'bento',
    theme: 'cyber-dark',
    sectionVisibility: {
      showAcademics: true,
      showCertifications: true,
      showCodingStats: true,
      showProjects: true,
      showSkills: true,
      showAssessments: true,
      showInterviewScore: true
    },
    publishedAt: new Date().toISOString()
  });

  saveDatabase();
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dbData = {
        ...INITIAL_DB_STRUCTURE,
        ...parsed
      };
    }
    if (dbData.users.length === 0) {
      seedDemoStudent();
    }
  } catch (err) {
    console.error('Failed to load DB file, initializing clean database:', err);
    seedDemoStudent();
  }
}

function saveDatabase() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(dbData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Database write error:', err);
  }
}

// Initialize on module load
loadDatabase();

export const db = {
  // Raw access if needed
  raw: () => dbData,
  save: () => saveDatabase(),

  // Users
  users: {
    findByEmail: (email) => {
      const clean = (email || '').trim().toLowerCase();
      return dbData.users.find(u => u.email.toLowerCase() === clean);
    },
    findById: (id) => dbData.users.find(u => u.id === id),
    create: ({ id, email, passwordHash }) => {
      const user = {
        id: id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email: email.trim().toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dbData.users.push(user);
      saveDatabase();
      return user;
    },
    updatePassword: (userId, newHash) => {
      const user = dbData.users.find(u => u.id === userId);
      if (user) {
        user.passwordHash = newHash;
        user.updatedAt = new Date().toISOString();
        saveDatabase();
      }
      return user;
    }
  },

  // Student Profiles
  profiles: {
    getByUserId: (userId) => dbData.profiles.find(p => p.userId === userId) || null,
    upsert: (userId, data) => {
      let profile = dbData.profiles.find(p => p.userId === userId);
      if (!profile) {
        profile = {
          userId,
          fullName: data.fullName || '',
          profilePhoto: data.profilePhoto || null,
          email: data.email || '',
          phone: data.phone || '',
          college: data.college || '',
          degree: data.degree || '',
          department: data.department || '',
          graduationYear: data.graduationYear || '',
          location: data.location || '',
          linkedInUrl: data.linkedInUrl || '',
          githubUrl: data.githubUrl || '',
          headline: data.headline || '',
          aboutMe: data.aboutMe || '',
          targetRoleId: data.targetRoleId || 'fullstack-developer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        dbData.profiles.push(profile);
      } else {
        Object.assign(profile, data, { updatedAt: new Date().toISOString() });
      }
      saveDatabase();
      return profile;
    }
  },

  // Academic Records
  academics: {
    getByUserId: (userId) => {
      let record = dbData.academics.find(a => a.userId === userId);
      if (!record) {
        record = {
          userId,
          status: 'Not Started',
          sem1Status: 'Not Uploaded',
          marksheets: [],
          calculatedCgpa: null,
          documentCgpa: null,
          hasDiscrepancy: false,
          discrepancyNote: null,
          verifiedDate: null
        };
        dbData.academics.push(record);
        saveDatabase();
      }
      return record;
    },
    saveRecord: (userId, recordData) => {
      const idx = dbData.academics.findIndex(a => a.userId === userId);
      if (idx >= 0) {
        dbData.academics[idx] = { ...dbData.academics[idx], ...recordData };
      } else {
        dbData.academics.push({ userId, ...recordData });
      }
      saveDatabase();
      return dbData.academics.find(a => a.userId === userId);
    }
  },

  // Certifications
  certifications: {
    getByUserId: (userId) => dbData.certifications.filter(c => c.userId === userId),
    getById: (id) => dbData.certifications.find(c => c.id === id),
    add: (userId, certData) => {
      const cert = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        title: certData.title || '',
        studentName: certData.studentName || '',
        issuer: certData.issuer || '',
        certificateId: certData.certificateId || '',
        issueDate: certData.issueDate || '',
        expiryDate: certData.expiryDate || '',
        courseName: certData.courseName || '',
        duration: certData.duration || '',
        scoreGrade: certData.scoreGrade || '',
        credentialUrl: certData.credentialUrl || '',
        verificationUrl: certData.verificationUrl || '',
        qrCodeData: certData.qrCodeData || '',
        filePath: certData.filePath || null,
        fileName: certData.fileName || null,
        status: certData.status || 'Pending Verification',
        verificationEvidence: certData.verificationEvidence || null,
        skillsVerified: certData.skillsVerified || [],
        uploadedAt: new Date().toISOString()
      };
      dbData.certifications.push(cert);
      saveDatabase();
      return cert;
    },
    update: (id, certData) => {
      const cert = dbData.certifications.find(c => c.id === id);
      if (cert) {
        Object.assign(cert, certData);
        saveDatabase();
      }
      return cert;
    },
    delete: (id) => {
      const idx = dbData.certifications.findIndex(c => c.id === id);
      if (idx >= 0) {
        const removed = dbData.certifications.splice(idx, 1)[0];
        saveDatabase();
        return removed;
      }
      return null;
    }
  },

  // Coding Profiles (GitHub & LeetCode)
  codingProfiles: {
    getByUserId: (userId) => {
      let profile = dbData.codingProfiles.find(c => c.userId === userId);
      if (!profile) {
        profile = {
          userId,
          github: {
            username: '',
            profileUrl: '',
            connected: false,
            publicRepos: 0,
            starsCount: 0,
            topLanguages: [],
            repos: [],
            lastFetched: null
          },
          leetcode: {
            username: '',
            profileUrl: '',
            connected: false,
            totalSolved: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            contestRating: null,
            ranking: null,
            badges: [],
            acceptanceRate: null,
            lastFetched: null
          }
        };
        dbData.codingProfiles.push(profile);
        saveDatabase();
      }
      return profile;
    },
    save: (userId, profileData) => {
      let profile = dbData.codingProfiles.find(c => c.userId === userId);
      if (profile) {
        Object.assign(profile, profileData);
      } else {
        profile = { userId, ...profileData };
        dbData.codingProfiles.push(profile);
      }
      saveDatabase();
      return profile;
    }
  },

  // Projects
  projects: {
    getByUserId: (userId) => dbData.projects.filter(p => p.userId === userId),
    getById: (id) => dbData.projects.find(p => p.id === id),
    add: (userId, projData) => {
      const proj = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        title: projData.title || '',
        problemStatement: projData.problemStatement || '',
        solution: projData.solution || '',
        description: projData.description || '',
        technologies: Array.isArray(projData.technologies) ? projData.technologies : [],
        roleContribution: projData.roleContribution || '',
        teamSize: projData.teamSize || '1',
        githubUrl: projData.githubUrl || '',
        demoUrl: projData.demoUrl || '',
        screenshots: projData.screenshots || [],
        outcome: projData.outcome || '',
        duration: projData.duration || '',
        isImportedFromGithub: !!projData.isImportedFromGithub,
        createdAt: new Date().toISOString()
      };
      dbData.projects.push(proj);
      saveDatabase();
      return proj;
    },
    update: (id, projData) => {
      const proj = dbData.projects.find(p => p.id === id);
      if (proj) {
        Object.assign(proj, projData);
        saveDatabase();
      }
      return proj;
    },
    delete: (id) => {
      const idx = dbData.projects.findIndex(p => p.id === id);
      if (idx >= 0) {
        const removed = dbData.projects.splice(idx, 1)[0];
        saveDatabase();
        return removed;
      }
      return null;
    }
  },

  // Skills
  skills: {
    getByUserId: (userId) => dbData.skills.filter(s => s.userId === userId),
    add: (userId, skillData) => {
      const skill = {
        id: `skl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        name: skillData.name.trim(),
        category: skillData.category || 'Programming',
        proficiency: typeof skillData.proficiency === 'number' ? skillData.proficiency : 75,
        source: skillData.source || 'manual',
        verified: !!skillData.verified
      };
      dbData.skills.push(skill);
      saveDatabase();
      return skill;
    },
    update: (id, skillData) => {
      const skill = dbData.skills.find(s => s.id === id);
      if (skill) {
        Object.assign(skill, skillData);
        saveDatabase();
      }
      return skill;
    },
    delete: (id) => {
      const idx = dbData.skills.findIndex(s => s.id === id);
      if (idx >= 0) {
        const removed = dbData.skills.splice(idx, 1)[0];
        saveDatabase();
        return removed;
      }
      return null;
    }
  },

  // Assessment Attempts (50 MCQs)
  assessments: {
    getByUserId: (userId) => dbData.assessmentAttempts.filter(a => a.userId === userId),
    getAttempt: (userId, topicId) => {
      return dbData.assessmentAttempts.find(a => a.userId === userId && a.topicId === topicId) || null;
    },
    saveProgress: (userId, topicId, answers) => {
      let attempt = dbData.assessmentAttempts.find(a => a.userId === userId && a.topicId === topicId);
      if (!attempt) {
        attempt = {
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          topicId,
          attemptNumber: 1,
          status: 'In Progress',
          answers: answers || {},
          score: null, // Critical: MUST NOT update score while incomplete!
          correctCount: null,
          incorrectCount: null,
          totalCount: 50,
          strengths: [],
          weaknesses: [],
          history: [],
          startedAt: new Date().toISOString(),
          completedAt: null
        };
        dbData.assessmentAttempts.push(attempt);
      } else {
        // Keep status 'In Progress' if not previously completed
        attempt.answers = { ...attempt.answers, ...answers };
        if (attempt.status !== 'Completed') {
          attempt.status = 'In Progress';
        }
      }
      saveDatabase();
      return attempt;
    },
    finalizeSubmission: (userId, topicId, evaluationResult) => {
      let attempt = dbData.assessmentAttempts.find(a => a.userId === userId && a.topicId === topicId);
      if (!attempt) {
        attempt = {
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId,
          topicId,
          attemptNumber: 1,
          history: []
        };
        dbData.assessmentAttempts.push(attempt);
      }

      // Record in attempt history
      const historyRecord = {
        attemptNumber: attempt.attemptNumber || 1,
        date: new Date().toISOString(),
        score: evaluationResult.score,
        correctCount: evaluationResult.correctCount,
        incorrectCount: evaluationResult.incorrectCount
      };

      attempt.status = 'Completed';
      attempt.score = evaluationResult.score;
      attempt.correctCount = evaluationResult.correctCount;
      attempt.incorrectCount = evaluationResult.incorrectCount;
      attempt.totalCount = 50;
      attempt.strengths = evaluationResult.strengths || [];
      attempt.weaknesses = evaluationResult.weaknesses || [];
      attempt.answers = evaluationResult.answers || attempt.answers;
      attempt.completedAt = new Date().toISOString();
      attempt.history = attempt.history || [];
      attempt.history.push(historyRecord);

      saveDatabase();
      return attempt;
    }
  },

  // Mock Interview Sessions
  interviews: {
    getByUserId: (userId) => dbData.interviewSessions.filter(i => i.userId === userId),
    getLatestByUserId: (userId) => {
      const list = dbData.interviewSessions.filter(i => i.userId === userId);
      return list.length > 0 ? list[list.length - 1] : null;
    },
    saveSession: (userId, sessionData) => {
      const session = {
        id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        targetRoleId: sessionData.targetRoleId,
        questions: sessionData.questions || [],
        answers: sessionData.answers || [],
        scores: sessionData.scores || {
          technical: 75,
          communication: 80,
          problemSolving: 78,
          projectKnowledge: 82,
          overall: 78
        },
        feedback: sessionData.feedback || {},
        acousticMetrics: sessionData.acousticMetrics || {
          paceWpm: 140,
          fillerWords: 2,
          durationSec: 120
        },
        completedAt: new Date().toISOString()
      };
      dbData.interviewSessions.push(session);
      saveDatabase();
      return session;
    }
  },

  // Portfolios
  portfolios: {
    getByUserId: (userId) => {
      let p = dbData.portfolios.find(item => item.userId === userId);
      if (!p) {
        p = {
          userId,
          slug: '',
          isPublic: true,
          template: 'modern-dark',
          theme: 'cyan-slate',
          customHeadline: '',
          customAbout: '',
          sectionVisibility: {
            hero: true,
            about: true,
            education: true,
            skills: true,
            projects: true,
            certifications: true,
            coding: true,
            achievements: true,
            assessments: true,
            careerReadiness: true,
            contact: true
          },
          projectOrder: [],
          skillOrder: [],
          publishedAt: null,
          updatedAt: new Date().toISOString()
        };
        dbData.portfolios.push(p);
        saveDatabase();
      }
      return p;
    },
    getBySlug: (slug) => {
      const clean = (slug || '').trim().toLowerCase();
      return dbData.portfolios.find(p => (p.slug || '').toLowerCase() === clean && p.isPublic);
    },
    save: (userId, data) => {
      let p = dbData.portfolios.find(item => item.userId === userId);
      if (p) {
        Object.assign(p, data, { updatedAt: new Date().toISOString() });
      } else {
        p = { userId, ...data, updatedAt: new Date().toISOString() };
        dbData.portfolios.push(p);
      }
      saveDatabase();
      return p;
    }
  }
};
