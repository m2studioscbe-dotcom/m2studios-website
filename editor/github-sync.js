// GitHub sync functionality for GrapesJS
// This will save designs directly to your GitHub repository

async function syncToGitHub(html, css) {
    const GITHUB_TOKEN = localStorage.getItem('github_token');
    const REPO_OWNER = 'm2studioscbe-dotcom'; // GitHub username
    const REPO_NAME = 'm2studios-website'; // Repository name
    const FILE_PATH = 'index.html'; // Path where the design should be saved
    
    if (!GITHUB_TOKEN) {
        alert('GitHub token not set. Please set it first using the Settings panel.');
        return;
    }
    
    try {
        // Get current file SHA (required for updates)
        const getResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        const fileData = await getResponse.json();
        const sha = fileData.sha;
        
        // Prepare content
        const fullContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M2 Studios</title>
    <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;
        
        // Commit to GitHub
        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update design from GrapesJS editor',
                    content: btoa(fullContent), // Base64 encode
                    sha: sha
                })
            }
        );
        
        if (updateResponse.ok) {
            alert('✓ Design saved to GitHub! Netlify will auto-deploy in 1-2 minutes.');
        } else {
            const error = await updateResponse.json();
            alert('Error: ' + error.message);
        }
        
    } catch (error) {
        console.error('GitHub sync error:', error);
        alert('Failed to sync with GitHub. Check console for details.');
    }
}

// Token management UI
function createTokenSettings() {
    const panel = document.createElement('div');
    panel.id = 'github-settings';
    panel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: white; padding: 15px; border: 1px solid #ccc; border-radius: 5px; z-index: 9999; display: none;">
            <h4>GitHub Settings</h4>
            <label>GitHub Token:</label><br>
            <input type="password" id="github-token-input" style="width: 250px; margin: 10px 0;" placeholder="ghp_..."><br>
            <button id="save-token-btn" style="margin-right: 10px;">Save Token</button>
            <button id="close-settings-btn">Close</button>
        </div>
        <button id="open-settings-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">⚙️ GitHub Setup</button>
    `;
    document.body.appendChild(panel);
    
    document.getElementById('open-settings-btn').onclick = () => {
        document.querySelector('#github-settings > div').style.display = 'block';
    };
    
    document.getElementById('close-settings-btn').onclick = () => {
        document.querySelector('#github-settings > div').style.display = 'none';
    };
    
    document.getElementById('save-token-btn').onclick = () => {
        const token = document.getElementById('github-token-input').value;
        if (token) {
            localStorage.setItem('github_token', token);
            alert('Token saved! You can now sync to GitHub.');
        }
    };
    
    // Load existing token if any
    const existingToken = localStorage.getItem('github_token');
    if (existingToken) {
        document.getElementById('github-token-input').value = existingToken;
    }
}

// Initialize on page load
if (typeof window !== 'undefined') {
    createTokenSettings();
}
