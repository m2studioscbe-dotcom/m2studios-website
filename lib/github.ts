// GitHub Helper Library for M2 Studios
// Provides utility functions for interacting with GitHub API

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

// GitHub configuration (loaded from environment variables)
const getConfig = (): GitHubConfig => ({
  token: process.env.GITHUB_TOKEN || '',
  owner: process.env.GITHUB_REPO_OWNER || 'm2studioscbe-dotcom',
  repo: process.env.GITHUB_REPO_NAME || 'm2studios-website',
  branch: process.env.GITHUB_BRANCH || 'main'
});

/**
 * Get GitHub API base URL
 */
function getApiUrl(): string {
  const config = getConfig();
  return `https://api.github.com/repos/${config.owner}/${config.repo}`;
}

/**
 * Make a GitHub API request
 */
async function githubRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const config = getConfig();
  
  if (!config.token) {
    throw new Error('GitHub token not configured');
  }
  
  const url = `${getApiUrl()}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${error}`);
  }
  
  return response.json();
}

/**
 * Get file content from repository
 */
export async function getFileContent(path: string): Promise<string> {
  const config = getConfig();
  const data = await githubRequest(`/contents/${path}?ref=${config.branch}`);
  
  // Decode base64 content
  return atob(data.content);
}

/**
 * Create or update a file in the repository
 */
export async function saveFile(
  path: string,
  content: string,
  message: string = 'Update via M2 Studios Editor'
): Promise<any> {
  const config = getConfig();
  
  // Get current file SHA if it exists
  let sha: string | undefined;
  try {
    const existing = await githubRequest(`/contents/${path}?ref=${config.branch}`);
    sha = existing.sha;
  } catch (error) {
    // File doesn't exist, that's okay
  }
  
  // Create or update file
  return githubRequest(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: btoa(content), // Base64 encode
      branch: config.branch,
      ...(sha && { sha })
    })
  });
}

/**
 * Save page content to GitHub
 */
export async function savePage(
  pageName: string,
  html: string,
  css: string
): Promise<any> {
  const htmlPath = `${pageName}.html`;
  const cssPath = `styles/${pageName}.css`;
  
  // Save HTML file
  const htmlResult = await saveFile(
    htmlPath,
    html,
    `Update ${pageName} page content`
  );
  
  // Save CSS file if provided
  if (css) {
    await saveFile(
      cssPath,
      css,
      `Update ${pageName} page styles`
    );
  }
  
  return htmlResult;
}

/**
 * Load page content from GitHub
 */
export async function loadPage(pageName: string): Promise<{ html: string; css: string }> {
  const htmlPath = `${pageName}.html`;
  const cssPath = `styles/${pageName}.css`;
  
  const html = await getFileContent(htmlPath);
  
  let css = '';
  try {
    css = await getFileContent(cssPath);
  } catch (error) {
    // CSS file might not exist
  }
  
  return { html, css };
}

/**
 * Get repository information
 */
export async function getRepoInfo(): Promise<any> {
  return githubRequest('');
}

/**
 * Get latest commits
 */
export async function getCommits(limit: number = 10): Promise<any[]> {
  const config = getConfig();
  return githubRequest(`/commits?sha=${config.branch}&per_page=${limit}`);
}

/**
 * Create a commit with multiple files
 */
export async function createCommit(
  files: Array<{ path: string; content: string }>,
  message: string
): Promise<any> {
  const config = getConfig();
  
  // Get the latest commit SHA
  const ref = await githubRequest(`/git/ref/heads/${config.branch}`);
  const latestCommitSha = ref.object.sha;
  
  // Get the tree SHA from the latest commit
  const latestCommit = await githubRequest(`/git/commits/${latestCommitSha}`);
  const baseTreeSha = latestCommit.tree.sha;
  
  // Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await githubRequest('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({
          content: btoa(file.content),
          encoding: 'base64'
        })
      });
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      };
    })
  );
  
  // Create a new tree
  const tree = await githubRequest('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: blobs
    })
  });
  
  // Create a new commit
  const commit = await githubRequest('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [latestCommitSha]
    })
  });
  
  // Update the reference
  await githubRequest(`/git/refs/heads/${config.branch}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commit.sha
    })
  });
  
  return commit;
}

export default {
  getFileContent,
  saveFile,
  savePage,
  loadPage,
  getRepoInfo,
  getCommits,
  createCommit
};
