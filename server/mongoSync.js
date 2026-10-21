import {
  connectMongo,
  isMongoConnected,
  User,
  Profile,
  AcademicRecord,
  Certification,
  Project,
  CodingProfile,
  AssessmentAttempt,
  InterviewSession,
  CareerReadiness,
  Portfolio,
  Skill
} from './models/index.js';

/**
 * Initializes MongoDB connection and runs bidirectional sync with local cache
 * @param {object} localDbData - In-memory database cache
 */
export async function initializeMongoIntegration(localDbData) {
  const connected = await connectMongo();
  if (!connected) {
    return false;
  }

  try {
    // 1. Check if MongoDB has existing users; if not, seed from localDbData
    const userCount = await User.countDocuments();
    if (userCount === 0 && localDbData.users && localDbData.users.length > 0) {
      console.log('[MongoDB] Seeding initial data from local records into MongoDB collections...');
      await syncLocalToMongo(localDbData);
      console.log('[MongoDB] Initial migration to MongoDB collections completed successfully.');
    } else if (userCount > 0) {
      // If MongoDB already has data, pull latest from MongoDB into memory
      console.log('[MongoDB] Existing collections found. Syncing MongoDB records to local memory...');
      await syncMongoToLocal(localDbData);
    }
    return true;
  } catch (err) {
    console.error('[MongoDB Sync Error]:', err.message);
    return false;
  }
}

/**
 * Upsert all local records to MongoDB
 */
export async function syncLocalToMongo(localDbData) {
  if (!isMongoConnected()) return;

  try {
    // Users
    for (const u of localDbData.users || []) {
      await User.findOneAndUpdate(
        { email: u.email },
        { ...u },
        { upsert: true, new: true }
      );
    }

    // Profiles
    for (const p of localDbData.profiles || []) {
      await Profile.findOneAndUpdate(
        { userId: p.userId },
        { ...p, institution: p.college, branch: p.department, year: p.graduationYear, targetRole: p.targetRoleId },
        { upsert: true, new: true }
      );
    }

    // Academic Records
    for (const a of localDbData.academics || []) {
      await AcademicRecord.findOneAndUpdate(
        { userId: a.userId },
        { ...a },
        { upsert: true, new: true }
      );
    }

    // Certifications
    for (const c of localDbData.certifications || []) {
      await Certification.findOneAndUpdate(
        { id: c.id },
        { ...c, verificationStatus: c.status, credentialId: c.certificateId },
        { upsert: true, new: true }
      );
    }

    // Projects
    for (const pr of localDbData.projects || []) {
      await Project.findOneAndUpdate(
        { id: pr.id },
        { ...pr, outcomes: pr.outcome, repositoryUrl: pr.githubUrl },
        { upsert: true, new: true }
      );
    }

    // Coding Profiles
    for (const cp of localDbData.codingProfiles || []) {
      await CodingProfile.findOneAndUpdate(
        { userId: cp.userId },
        {
          ...cp,
          repositoryCount: cp.github?.publicRepos || 0,
          solvedCount: cp.leetcode?.totalSolved || 0
        },
        { upsert: true, new: true }
      );
    }

    // Assessment Attempts
    for (const att of localDbData.assessmentAttempts || []) {
      await AssessmentAttempt.findOneAndUpdate(
        { id: att.id },
        { ...att, submittedAt: att.completedAt },
        { upsert: true, new: true }
      );
    }

    // Interview Sessions
    for (const iv of localDbData.interviewSessions || []) {
      await InterviewSession.findOneAndUpdate(
        { id: iv.id },
        {
          ...iv,
          wpm: iv.acousticMetrics?.paceWpm || 140,
          fillerCount: iv.acousticMetrics?.fillerWords || 2
        },
        { upsert: true, new: true }
      );
    }

    // Portfolios
    for (const port of localDbData.portfolios || []) {
      await Portfolio.findOneAndUpdate(
        { userId: port.userId },
        {
          ...port,
          visibility: port.isPublic ? 'public' : 'private',
          visibleSections: port.sectionVisibility || {}
        },
        { upsert: true, new: true }
      );
    }

    // Skills
    for (const s of localDbData.skills || []) {
      await Skill.findOneAndUpdate(
        { id: s.id },
        { ...s },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.warn('[MongoDB Background Sync Warning]:', err.message);
  }
}

/**
 * Sync MongoDB records into local memory cache
 */
export async function syncMongoToLocal(localDbData) {
  if (!isMongoConnected()) return;

  try {
    const users = await User.find().lean();
    if (users.length > 0) localDbData.users = users;

    const profiles = await Profile.find().lean();
    if (profiles.length > 0) localDbData.profiles = profiles;

    const academics = await AcademicRecord.find().lean();
    if (academics.length > 0) localDbData.academics = academics;

    const certs = await Certification.find().lean();
    if (certs.length > 0) localDbData.certifications = certs;

    const projs = await Project.find().lean();
    if (projs.length > 0) localDbData.projects = projs;

    const coding = await CodingProfile.find().lean();
    if (coding.length > 0) localDbData.codingProfiles = coding;

    const assessments = await AssessmentAttempt.find().lean();
    if (assessments.length > 0) localDbData.assessmentAttempts = assessments;

    const interviews = await InterviewSession.find().lean();
    if (interviews.length > 0) localDbData.interviewSessions = interviews;

    const portfolios = await Portfolio.find().lean();
    if (portfolios.length > 0) localDbData.portfolios = portfolios;

    const skills = await Skill.find().lean();
    if (skills.length > 0) localDbData.skills = skills;
  } catch (err) {
    console.warn('[MongoDB Pull Warning]:', err.message);
  }
}
