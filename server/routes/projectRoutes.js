import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// GET /api/projects
router.get('/', authMiddleware, (req, res) => {
  const projects = db.projects.getByUserId(req.user.id);
  res.json({
    projects,
    totalCount: projects.length
  });
});

// POST /api/projects
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      title,
      problemStatement,
      solution,
      description,
      technologies,
      role,
      roleContribution,
      teamSize,
      githubUrl,
      demoUrl,
      screenshots,
      outcome,
      duration,
      isImportedFromGithub
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    let parsedTech = [];
    if (typeof technologies === 'string') {
      parsedTech = technologies.split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(technologies)) {
      parsedTech = technologies;
    }

    const newProject = db.projects.add(req.user.id, {
      title: title.trim(),
      problemStatement: problemStatement ? problemStatement.trim() : (description ? description.trim() : 'Real-world problem statement formulation.'),
      solution: solution ? solution.trim() : 'Engineered solution implementation.',
      description: description ? description.trim() : (solution ? solution.trim() : ''),
      technologies: parsedTech,
      role: role ? role.trim() : (roleContribution ? roleContribution.trim() : 'Lead Developer'),
      roleContribution: roleContribution ? roleContribution.trim() : (role ? role.trim() : 'Lead Developer'),
      teamSize: teamSize ? teamSize.toString() : '1',
      githubUrl: githubUrl ? githubUrl.trim() : '',
      demoUrl: demoUrl ? demoUrl.trim() : '',
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      outcome: outcome ? outcome.trim() : 'Validated deployment performance metrics.',
      duration: duration ? duration.trim() : '3 months',
      isImportedFromGithub: !!isImportedFromGithub
    });

    // Automatically infer skills from project technologies (Section 10)
    parsedTech.forEach(tech => {
      const existing = db.skills.getByUserId(req.user.id).find(s => s.name.toLowerCase() === tech.toLowerCase());
      if (!existing) {
        db.skills.add(req.user.id, {
          name: tech,
          category: 'Web Development',
          proficiency: 80,
          source: 'project',
          verified: false
        });
      }
    });

    const allProjects = db.projects.getByUserId(req.user.id);

    res.status(201).json({
      message: 'Project created successfully.',
      project: newProject,
      projects: allProjects
    });
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// POST /api/projects/import-github
// Import repository from connected GitHub profile (Section 9)
router.post('/import-github', authMiddleware, (req, res) => {
  try {
    const { repoName, repoUrl } = req.body;
    const coding = db.codingProfiles.getByUserId(req.user.id);
    const repos = coding?.github?.repos || [];
    
    let repo = null;
    if (repoName) {
      repo = repos.find(r => r.name.toLowerCase() === repoName.toLowerCase());
    } else if (repoUrl) {
      repo = repos.find(r => r.htmlUrl?.toLowerCase() === repoUrl.toLowerCase() || r.url?.toLowerCase() === repoUrl.toLowerCase());
      if (!repo && repoUrl.includes('github.com')) {
        const parts = repoUrl.split('/').filter(Boolean);
        const namePart = parts[parts.length - 1];
        repo = {
          name: namePart,
          htmlUrl: repoUrl,
          description: 'Imported from GitHub repository URL',
          language: 'JavaScript',
          topics: ['react', 'web-app']
        };
      }
    }

    if (!repo) {
      return res.status(404).json({ error: `Repository not found. Please verify the repository name or sync GitHub first.` });
    }

    const techList = [];
    if (repo.language) techList.push(repo.language);
    if (Array.isArray(repo.topics)) techList.push(...repo.topics);
    if (techList.length === 0) techList.push('JavaScript', 'Full Stack');

    const imported = db.projects.add(req.user.id, {
      title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      problemStatement: `Automating workflows and addressing scaling challenges via ${repo.name}.`,
      solution: repo.description || 'Engineered responsive full-stack software application with modular components.',
      description: repo.description || 'Engineered responsive full-stack software application with modular components.',
      technologies: techList,
      role: 'Full Stack Engineer & Maintainer',
      roleContribution: 'Full Stack Engineer & Maintainer',
      teamSize: '1',
      githubUrl: repo.htmlUrl || repo.url || `https://github.com/${repo.name}`,
      demoUrl: '',
      screenshots: [],
      outcome: `Published repository with ${repo.stars || 0} stars and verified git commits.`,
      duration: 'Ongoing',
      isImportedFromGithub: true
    });

    const allProjects = db.projects.getByUserId(req.user.id);

    res.json({
      message: `Repository '${repo.name}' imported as project.`,
      project: imported,
      projects: allProjects
    });
  } catch (err) {
    console.error('Import GitHub error:', err);
    res.status(500).json({ error: 'Failed to import repository from GitHub.' });
  }
});

// PUT /api/projects/:id
router.put('/:id', authMiddleware, (req, res) => {
  const proj = db.projects.getById(req.params.id);
  if (!proj || proj.userId !== req.user.id) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const updated = db.projects.update(proj.id, req.body);
  const allProjects = db.projects.getByUserId(req.user.id);
  res.json({ message: 'Project updated.', project: updated, projects: allProjects });
});

// DELETE /api/projects/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const proj = db.projects.getById(req.params.id);
  if (!proj || proj.userId !== req.user.id) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  db.projects.delete(proj.id);
  const allProjects = db.projects.getByUserId(req.user.id);
  res.json({ message: 'Project removed.', projects: allProjects });
});

export default router;
