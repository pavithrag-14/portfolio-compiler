import mongoose from 'mongoose';

const codingProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  provider: { type: String, default: 'GitHub & LeetCode' },
  username: { type: String, default: '' },
  repositoryCount: { type: Number, default: 0 },
  solvedCount: { type: Number, default: 0 },
  syncedAt: { type: Date, default: Date.now },
  github: {
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    connected: { type: Boolean, default: false },
    publicRepos: { type: Number, default: 0 },
    starsCount: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    topLanguages: [{ language: String, count: Number }],
    repos: [{
      name: String,
      description: String,
      language: String,
      stars: Number,
      forks: Number,
      htmlUrl: String,
      updatedAt: String
    }],
    lastFetched: { type: Date, default: null }
  },
  leetcode: {
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    connected: { type: Boolean, default: false },
    totalSolved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    contestRating: { type: Number, default: null },
    ranking: { type: mongoose.Schema.Types.Mixed, default: null },
    badges: [{ type: String }],
    acceptanceRate: { type: String, default: null },
    lastFetched: { type: Date, default: null }
  }
}, {
  timestamps: true,
  collection: 'codingProfiles'
});

export const CodingProfile = mongoose.models.CodingProfile || mongoose.model('CodingProfile', codingProfileSchema);
