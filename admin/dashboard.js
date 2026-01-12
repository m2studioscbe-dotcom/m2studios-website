// M2 Studios Admin Dashboard JavaScript

// Load metrics on page load
window.addEventListener('DOMContentLoaded', () => {
    loadMetrics();
    loadWorkflows();
    console.log('✅ M2 Studios Admin Dashboard loaded!');
});

// Load dashboard metrics
async function loadMetrics() {
    try {
        // Fetch last deployment info
        const deployInfo = await fetch('/api/deploy?action=status').catch(() => null);
        if (deployInfo && deployInfo.ok) {
            const data = await deployInfo.json();
            document.getElementById('last-deploy').textContent = data.lastDeploy || 'Never';
        } else {
            document.getElementById('last-deploy').textContent = 'N/A';
        }
        
        // Set total pages (static for now)
        document.getElementById('total-pages').textContent = '5';
        
        // Set AI requests (static for now)
        document.getElementById('ai-requests').textContent = '127';
        
    } catch (error) {
        console.error('Error loading metrics:', error);
    }
}

// Load workflow status
async function loadWorkflows() {
    // Workflow data is currently static in HTML
    // In production, this would fetch from N8n API
    console.log('Workflows loaded from static data');
}

// Refresh workflows
async function refreshWorkflows() {
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    try {
        await loadWorkflows();
        await loadMetrics();
        
        // Show success
        btn.innerHTML = '<i class="fas fa-check"></i> Refreshed!';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);
    } catch (error) {
        btn.innerHTML = '<i class="fas fa-times"></i> Error';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);
    }
}

// Trigger a workflow manually
async function triggerWorkflow(workflowName) {
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        let endpoint;
        switch(workflowName) {
            case 'page_save':
                endpoint = '/api/save';
                break;
            case 'page_load':
                endpoint = '/api/load';
                break;
            case 'deploy_trigger':
                endpoint = '/api/deploy';
                break;
            case 'ai_generate':
                endpoint = '/api/ai';
                break;
            default:
                endpoint = null;
        }
        
        if (endpoint) {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manual: true, timestamp: new Date().toISOString() })
            });
            
            const result = await response.json();
            
            if (result.success) {
                addLogEntry(`${workflowName} executed successfully`, 'success');
                btn.innerHTML = '<i class="fas fa-check"></i> Success';
            } else {
                throw new Error(result.error || 'Execution failed');
            }
        } else {
            addLogEntry(`${workflowName} triggered (test mode)`, 'success');
            btn.innerHTML = '<i class="fas fa-check"></i> Success';
        }
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        addLogEntry(`${workflowName} failed: ${error.message}`, 'error');
        btn.innerHTML = '<i class="fas fa-times"></i> Failed';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);
    }
}

// View workflow logs
function viewLogs(workflowName) {
    alert(`Viewing logs for ${workflowName}\n\nIn production, this would show detailed execution logs from N8n.`);
}

// Add log entry
function addLogEntry(message, type = 'success') {
    const logContainer = document.getElementById('execution-log');
    const timestamp = new Date().toLocaleString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span>${message}</span>
    `;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Send AI command
async function sendAICommand() {
    const input = document.getElementById('ai-input');
    const command = input.value.trim();
    
    if (!command) return;
    
    // Add user message
    addChatMessage(command, 'user');
    input.value = '';
    
    // Process command
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: command,
                mode: 'text',
                context: 'admin_dashboard'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            addChatMessage(result.content || result.message || 'Command executed successfully', 'ai');
        } else {
            addChatMessage(`Error: ${result.error || 'Command failed'}`, 'ai');
        }
    } catch (error) {
        addChatMessage(`Error: ${error.message}`, 'ai');
    }
}

// Add chat message
function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    
    if (sender === 'ai') {
        message.innerHTML = `<strong>AI Assistant:</strong><br>${text}`;
    } else {
        message.innerHTML = `<strong>You:</strong><br>${text}`;
    }
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

console.log('✅ Dashboard JavaScript loaded!');
