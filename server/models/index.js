import mongoose from 'mongoose';

import { User } from './User.js';
import { Profile } from './Profile.js';
import { AcademicRecord } from './AcademicRecord.js';
import { Certification } from './Certification.js';
import { Project } from './Project.js';
import { CodingProfile } from './CodingProfile.js';
import { AssessmentAttempt } from './AssessmentAttempt.js';
import { InterviewSession } from './InterviewSession.js';
import { CareerReadiness } from './CareerReadiness.js';
import { Portfolio } from './Portfolio.js';
import { Skill } from './Skill.js';

let isConnected = false;

export async function connectMongo(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_compiler';
  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${mongoUri.replace(/:[^:]*@/, ':****@')}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Could not connect to MongoDB (${err.message}). Seamlessly operating with atomic local storage.`);
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export {
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
};
