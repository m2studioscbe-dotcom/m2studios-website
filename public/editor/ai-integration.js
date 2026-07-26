// AI Integration for M2 Studios GrapesJS Editor
// Connects to /api/ai endpoint (which calls n8n webhook)

// Create AI Panel UI
function createAIPanel() {
    const panel = document.createElement('div');
    panel.id = 'ai-panel';
    panel.innerHTML = `
        <div id="ai-panel-container" style="position: fixed; right: 20px; bottom: 80px; width: 350px; background: white; border: 2px solid #4CAF50; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: none;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">🤖</span> AI Content Generator
                </h3>
                <button id="close-ai-panel" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">&times;</button>
            </div>
            
            <div style="padding: 20px;">
                <!-- Content Type Selector -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Generate:</label>
                    <div style="display: flex; gap: 10px;">
                        <button id="ai-mode-text" class="ai-mode-btn" data-mode="text" style="flex: 1; padding: 10px; border: 2px solid #667eea; background: #667eea; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">📝 Text</button>
                        <button id="ai-mode-image" class="ai-mode-btn" data-mode="image" style="flex: 1; padding: 10px; border: 2px solid #ddd; background: white; color: #666; border-radius: 5px; cursor: pointer; font-weight: bold;">🖼️ Image</button>
                    </div>
                </div>

                <!-- Prompt Templates -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Quick Templates:</label>
                    <select id="ai-template" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
                        <option value="">-- Select a template --</option>
                        <optgroup label="Text Templates">
                            <option value="Write a compelling headline for a dance studio in Coimbatore">Dance Studio Headline</option>
                            <option value="Write a description for professional photography services">Photography Description</option>
                            <option value="Create a call-to-action for booking dance classes">CTA for Dance Classes</option>
                            <option value="Write an about us section for M2 Studios">About Us Section</option>
                        </optgroup>
                        <optgroup label="Image Templates">
                            <option value="Modern dance studio with wooden floors and mirrors, professional lighting">Dance Studio Interior</option>
                            <option value="Professional photographer with camera, studio setup, creative lighting">Photography Studio</option>
                            <option value="Dance class in action, energetic students, colorful atmosphere">Dance Class Scene</option>
                            <option value="Event photography, wedding moments, candid shots">Event Photography</option>
                        </optgroup>
                    </select>
                </div>

                <!-- Prompt Input -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Your Prompt:</label>
                    <textarea id="ai-prompt" placeholder="Describe what you want to generate..." style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; font-family: Arial, sans-serif; resize: vertical;"></textarea>
                </div>

                <!-- Generate Button -->
                <button id="ai-generate-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    ✨ Generate Content
                </button>

                <!-- Loading Indicator -->
                <div id="ai-loading" style="display: none; margin-top: 15px; text-align: center; color: #667eea;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 10px; font-size: 14px;">Generating content...</p>
                </div>

                <!-- Result Display -->
                <div id="ai-result" style="display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #4CAF50;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="color: #4CAF50;">✓ Generated Content:</strong>
                        <button id="ai-insert-btn" style="padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Insert into Page</button>
                    </div>
                    <div id="ai-result-content" style="max-height: 200px; overflow-y: auto; font-size: 14px; line-height: 1.6;"></div>
                </div>

                <!-- Error Display -->
                <div id="ai-error" style="display: none; margin-top: 15px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ff9800; color: #856404;"></div>
            </div>
        </div>

        <!-- Floating AI Button -->
        <button id="open-ai-panel-btn" style="position: fixed; right: 20px; bottom: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); z-index: 9999; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="AI Content Generator">
            🤖
        </button>
    `;
    
    document.body.appendChild(panel);
    
    // Add CSS animation for loading spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    attachAIPanelEvents();
}

// Attach event listeners
function attachAIPanelEvents() {
    let currentMode = 'text';
    
    // Open/Close panel
    document.getElementById('open-ai-panel-btn').onclick = () => {
        document.getElementById('ai-panel-container').style.display = 'block';
    };
    
    document.getElementById('close-ai-panel').onclick = () => {
        document.getElementById('ai-panel-container').style.display = 'none';
    };
    
    // Mode switching
    document.querySelectorAll('.ai-mode-btn').forEach(btn => {
        btn.onclick = function() {
            currentMode = this.dataset.mode;
            document.querySelectorAll('.ai-mode-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color = '#666';
                b.style.borderColor = '#ddd';
            });
            this.style.background = '#667eea';
            this.style.color = 'white';
            this.style.borderColor = '#667eea';
        };
    });
    
    // Template selection
    document.getElementById('ai-template').onchange = function() {
        if (this.value) {
            document.getElementById('ai-prompt').value = this.value;
        }
    };
    
    // Generate content
    document.getElementById('ai-generate-btn').onclick = async () => {
        const prompt = document.getElementById('ai-prompt').value.trim();
        
        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }
        
        await generateContent(prompt, currentMode);
    };
    
    // Insert content into editor
    document.getElementById('ai-insert-btn').onclick = () => {
        insertContentIntoEditor();
    };
}

// Generate content via /api/ai endpoint
async function generateContent(prompt, mode) {
    const loadingEl = document.getElementById('ai-loading');
    const resultEl = document.getElementById('ai-result');
    const errorEl = document.getElementById('ai-error');
    
    // Show loading
    loadingEl.style.display = 'block';
    resultEl.style.display = 'none';
    errorEl.style.display = 'none';
    
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                mode: mode,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        loadingEl.style.display = 'none';
        
        if (data.success) {
            showResult(data, mode);
        } else {
            showError(data.error || 'Generation failed');
        }
        
    } catch (error) {
        loadingEl.style.display = 'none';
        showError(`Error: ${error.message}. Make sure the API is running.`);
        console.error('AI Generation Error:', error);
    }
}

// Show result
function showResult(data, mode) {
    const resultEl = document.getElementById('ai-result');
    const contentEl = document.getElementById('ai-result-content');
    
    if (mode === 'text') {
        contentEl.innerHTML = `<p style="white-space: pre-wrap;">${data.content || data.message}</p>`;
        resultEl.dataset.content = data.content || data.message;
        resultEl.dataset.type = 'text';
    } else if (mode === 'image') {
        const imageUrl = data.imageUrl || data.content;
        contentEl.innerHTML = `
            <img src="${imageUrl}" alt="Generated image" style="max-width: 100%; border-radius: 5px; margin-bottom: 10px;">
            <p style="font-size: 12px; color: #666;">Image URL: <a href="${imageUrl}" target="_blank" style="color: #667eea;">${imageUrl}</a></p>
        `;
        resultEl.dataset.content = imageUrl;
        resultEl.dataset.type = 'image';
    }
    
    resultEl.style.display = 'block';
}

// Show error
function showError(message) {
    const errorEl = document.getElementById('ai-error');
    errorEl.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
    errorEl.style.display = 'block';
}

// Insert content into GrapesJS editor
function insertContentIntoEditor() {
    const resultEl = document.getElementById('ai-result');
    const content = resultEl.dataset.content;
    const type = resultEl.dataset.type;
    
    if (!window.editor) {
        alert('Editor not found. Make sure GrapesJS is initialized.');
        return;
    }
    
    if (type === 'text') {
        // Insert text block
        window.editor.addComponents(`
            <div style="padding: 20px; margin: 10px 0;">
                <p>${content}</p>
            </div>
        `);
    } else if (type === 'image') {
        // Insert image block
        window.editor.addComponents(`
            <div style="padding: 20px; margin: 10px 0; text-align: center;">
                <img src="${content}" alt="AI Generated Image" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
        `);
    }
    
    alert('✓ Content inserted into editor!');
    document.getElementById('ai-panel-container').style.display = 'none';
}

// Initialize AI panel when page loads
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAIPanel);
    } else {
        createAIPanel();
    }
}

console.log('🤖 M2 Studios AI Integration loaded successfully!');
