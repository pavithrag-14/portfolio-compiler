import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OWNER = 'pavithrag-14';
const REPO = 'portfolio-compiler';
const BRANCH = 'main';

const token = process.argv[2] || process.env.GITHUB_TOKEN;
const commitMsg = process.argv[3] || 'Portfolio Compiler: complete all technical tasks (OCR, live APIs, atomic DB, deployment)';

if (!token) {
  console.error('\n[Error] GitHub Personal Access Token is required.');
  console.error('Usage: node server/pushToGithub.js <YOUR_GITHUB_TOKEN> [COMMIT_MESSAGE]\n');
  process.exit(1);
}

const IGNORE_PATTERNS = [
  'node_modules',
  'uploads',
  'dist',
  'build',
  '.git',
  '.env',
  '.DS_Store',
  'Thumbs.db'
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORE_PATTERNS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function githubRequest(endpoint, method = 'GET', body = null) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${token.trim()}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'PortfolioCompiler-DirectUploader',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'GitHub API request failed';
    const err = new Error(`[${response.status}] ${errorMsg}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function push() {
  console.log(`\n==================================================`);
  console.log(`  Portfolio Compiler -> GitHub Direct Pusher`);
  console.log(`  Target: https://github.com/${OWNER}/${REPO}`);
  console.log(`==================================================\n`);

  console.log('1. Checking repository status...');
  let parentCommitSha = null;
  try {
    const refData = await githubRequest(`/git/ref/heads/${BRANCH}`);
    parentCommitSha = refData.object.sha;
    console.log(`   Existing branch '${BRANCH}' found at commit: ${parentCommitSha}\n`);
  } catch (err) {
    if (err.status === 404 || err.status === 409) {
      console.log(`   Repository is currently empty. Initializing '${BRANCH}' branch...`);
      const initResp = await githubRequest('/contents/README.md', 'PUT', {
        message: 'Initial commit: repository setup',
        content: Buffer.from('# Portfolio Compiler\n\nAI-Powered Student Portfolio Compiler & Career Readiness Platform\n').toString('base64'),
        branch: BRANCH
      });
      parentCommitSha = initResp.commit.sha;
      console.log(`   Repository successfully initialized at commit: ${parentCommitSha}\n`);
    } else {
      throw err;
    }
  }

  console.log('2. Collecting project source files...');
  const filePaths = getAllFiles(rootDir);
  console.log(`   Found ${filePaths.length} files to push (node_modules/ & uploads/ excluded).\n`);

  console.log('3. Preparing Git file tree payload...');
  const treeItems = [];
  for (const filePath of filePaths) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');
    treeItems.push({
      path: relPath,
      mode: '100644',
      type: 'blob',
      content
    });
  }

  console.log('4. Uploading file tree to GitHub API...');
  const treePayload = {
    tree: treeItems
  };
  if (parentCommitSha) {
    treePayload.base_tree = parentCommitSha;
  }
  const treeResponse = await githubRequest('/git/trees', 'POST', treePayload);
  console.log(`   Created Tree SHA: ${treeResponse.sha}\n`);

  console.log('5. Creating Git commit...');
  const commitPayload = {
    message: commitMsg,
    tree: treeResponse.sha,
    parents: parentCommitSha ? [parentCommitSha] : []
  };
  const commitResponse = await githubRequest('/git/commits', 'POST', commitPayload);
  console.log(`   Created Commit SHA: ${commitResponse.sha}\n`);

  console.log(`6. Updating '${BRANCH}' branch...`);
  await githubRequest(`/git/refs/heads/${BRANCH}`, 'PATCH', {
    sha: commitResponse.sha,
    force: true
  });

  console.log(`\nSUCCESS! All ${filePaths.length} project files pushed directly to:`);
  console.log(`https://github.com/${OWNER}/${REPO}\n`);
}

push().catch(err => {
  console.error('\nPush failed:', err.message);
  if (err.data) {
    console.error('Details:', JSON.stringify(err.data, null, 2));
  }
  process.exit(1);
});
