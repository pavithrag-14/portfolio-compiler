// API client communicating with backend Express server (proxied via Vite on /api)

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('portfolio_compiler_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('portfolio_compiler_token', token);
  } else {
    localStorage.removeItem('portfolio_compiler_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle JSON vs FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) || (data && data.message) || response.statusText || 'Request failed';
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },

  // Student Profile
  profile: {
    get: () => request('/profile'),
    update: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  },

  // Academic Records
  academic: {
    getRecords: () => request('/academic/records'),
    uploadMarksheet: (formData) => request('/academic/upload-marksheet', { method: 'POST', body: formData }),
    updateSubject: (payload) => request('/academic/update-subject', { method: 'PUT', body: JSON.stringify(payload) }),
  },

  // Certifications
  certifications: {
    getAll: () => request('/certifications'),
    upload: (formData) => request('/certifications/upload', { method: 'POST', body: formData }),
    delete: (id) => request(`/certifications/${id}`, { method: 'DELETE' }),
    verifyManual: (id) => request(`/certifications/${id}/verify`, { method: 'POST' }),
  },

  // Coding Profiles
  coding: {
    get: () => request('/coding'),
    fetchGithub: (username) => request('/coding/github', { method: 'POST', body: JSON.stringify({ username }) }),
    fetchLeetcode: (username) => request('/coding/leetcode', { method: 'POST', body: JSON.stringify({ username }) }),
  },

  // Projects
  projects: {
    getAll: () => request('/projects'),
    create: (projectData) => request('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
    update: (id, projectData) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    importGithub: (repoUrl) => request('/projects/import-github', { method: 'POST', body: JSON.stringify({ repoUrl }) }),
  },

  // Skills
  skills: {
    getAll: () => request('/skills'),
    add: (skillData) => request('/skills', { method: 'POST', body: JSON.stringify(skillData) }),
    delete: (id) => request(`/skills/${id}`, { method: 'DELETE' }),
    infer: () => request('/skills/infer', { method: 'POST' }),
    gapAnalysis: (roleId) => request(`/skills/gap-analysis${roleId ? `?roleId=${roleId}` : ''}`),
  },

  // Target Roles
  roles: {
    getAll: () => request('/roles'),
    select: (roleId, customTitle) => request('/roles/select', { method: 'POST', body: JSON.stringify({ roleId, customTitle }) }),
  },

  // 50-MCQ Assessments
  assessments: {
    getTopics: () => request('/assessments/topics'),
    getQuestions: (topicId) => request(`/assessments/${topicId}/questions`),
    saveProgress: (topicId, answers, timeSpentSeconds) => 
      request('/assessments/save-progress', { method: 'POST', body: JSON.stringify({ topicId, answers, timeSpentSeconds }) }),
    submit: (topicId, answers, timeSpentSeconds) => 
      request('/assessments/submit', { method: 'POST', body: JSON.stringify({ topicId, answers, timeSpentSeconds }) }),
    getAttempts: () => request('/assessments/attempts'),
  },

  // AI Mock Interview
  interview: {
    getQuestions: () => request('/interview/generate-questions'),
    evaluate: (data) => request('/interview/evaluate', { method: 'POST', body: JSON.stringify(data) }),
    getSession: () => request('/interview/session'),
  },

  // Career Readiness Score
  readiness: {
    get: () => request('/readiness'),
  },

  // Portfolio
  portfolio: {
    getSettings: () => request('/portfolio/settings'),
    updateSettings: (settings) => request('/portfolio/settings', { method: 'PUT', body: JSON.stringify(settings) }),
    publish: (slug, isPublic) => request('/portfolio/publish', { method: 'POST', body: JSON.stringify({ slug, isPublic }) }),
    getPublic: (slug) => request(`/portfolio/public/${slug}`),
  },

  // Dashboard Central Summary
  dashboard: {
    getSummary: () => request('/dashboard/summary'),
  },
};
