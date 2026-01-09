// Enhanced M2 Studios AI Integration
// Replaces n8n webhook with direct OpenAI API integration
// Supports both text generation (GPT-4) and image generation (DALL-E 3)
// API KEY CONFIGURED - READY TO USE

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Direct API with your OpenAI key
        OPENAI_API_KEY: '', // Not needed - using Cloudflare Worker
        
        // Cloudflare Worker Proxy (optional, for better security)
        API_ENDPOINT: 'https://m2studios-ai-proxy.m2studios-cbe.workers.dev',
        
        // Using direct API (set to true to use Cloudflare Worker instead)
        USE_PROXY: true,
        OPENAI_DIRECT_URL: 'https://api.openai.com/v1',
        
        // Model settings
        TEXT_MODEL: 'gpt-4-turbo-preview',
        IMAGE_MODEL: 'dall-e-3',
        
        // Generation settings
        MAX_TOKENS: 500,
        TEMPERATURE: 0.7,
        IMAGE_SIZE: '1024x1024',
        IMAGE_QUALITY: 'standard'
    };

    // Initialize AI integration when editor is ready
    window.initM2AI = function(editor) {
        console.log('Initializing M2 Studios AI Integration...');

        // Add AI button to toolbar
        const aiButton = editor.Panels.addButton('options', {
            id: 'ai-generate',
            className: 'fa fa-magic',
            command: 'open-ai-modal',
            attributes: { title: '🤖 AI Generate' }
        });

        // Create AI modal
        editor.Commands.add('open-ai-modal', {
            run: function(editor, sender) {
                sender && sender.set('active', 0);
                showAIModal(editor);
            }
        });

        console.log('M2 Studios AI Integration loaded successfully!');
    };

    // Show AI generation modal
    function showAIModal(editor) {
        const modal = document.createElement('div');
        modal.className = 'm2-ai-modal';
        modal.innerHTML = `
            <div class="m2-ai-modal-content">
                <div class="m2-ai-modal-header">
                    <h2>🤖 AI Content Generator</h2>
                    <button class="m2-ai-close" onclick="this.closest('.m2-ai-modal').remove()">&times;</button>
                </div>
                <div class="m2-ai-modal-body">
                    <div class="m2-ai-tabs">
                        <button class="m2-ai-tab active" data-tab="text">✍️ Generate Text</button>
                        <button class="m2-ai-tab" data-tab="image">🎨 Generate Image</button>
                    </div>
                    
                    <div class="m2-ai-tab-content" id="text-tab">
                        <label>What do you want to write?</label>
                        <textarea id="text-prompt" placeholder="Example: Write a compelling headline for a dance studio that specializes in contemporary and hip-hop classes..." rows="4"></textarea>
                        <div class="m2-ai-options">
                            <label>
                                <input type="checkbox" id="make-longer"> Make it longer
                            </label>
                            <label>
                                <input type="checkbox" id="make-professional"> Professional tone
                            </label>
                        </div>
                        <button class="m2-ai-generate-btn" onclick="window.generateAIText()">✨ Generate Text</button>
                    </div>
                    
                    <div class="m2-ai-tab-content" id="image-tab" style="display: none;">
                        <label>Describe the image you want:</label>
                        <textarea id="image-prompt" placeholder="Example: A professional photo of dancers performing contemporary dance in a modern studio with natural lighting..." rows="4"></textarea>
                        <div class="m2-ai-options">
                            <label>Style:</label>
                            <select id="image-style">
                                <option value="">Natural/Realistic</option>
                                <option value="professional photography">Professional Photography</option>
                                <option value="artistic illustration">Artistic Illustration</option>
                                <option value="modern digital art">Modern Digital Art</option>
                                <option value="minimalist">Minimalist</option>
                            </select>
                        </div>
                        <button class="m2-ai-generate-btn" onclick="window.generateAIImage()">🎨 Generate Image</button>
                    </div>
                    
                    <div class="m2-ai-result" id="ai-result" style="display: none;">
                        <div class="m2-ai-loading">
                            <div class="m2-ai-spinner"></div>
                            <p>AI is generating your content...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .m2-ai-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .m2-ai-modal-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }
            .m2-ai-modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .m2-ai-modal-header h2 {
                margin: 0;
                font-size: 24px;
                color: #333;
            }
            .m2-ai-close {
                background: none;
                border: none;
                font-size: 32px;
                cursor: pointer;
                color: #999;
                line-height: 1;
            }
            .m2-ai-close:hover {
                color: #333;
            }
            .m2-ai-modal-body {
                padding: 20px;
            }
            .m2-ai-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .m2-ai-tab {
                flex: 1;
                padding: 12px;
                border: 2px solid #ddd;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            }
            .m2-ai-tab:hover {
                border-color: #007bff;
            }
            .m2-ai-tab.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            .m2-ai-tab-content label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }
            .m2-ai-tab-content textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                font-family: inherit;
                resize: vertical;
                margin-bottom: 15px;
            }
            .m2-ai-tab-content textarea:focus {
                outline: none;
                border-color: #007bff;
            }
            .m2-ai-options {
                margin-bottom: 15px;
            }
            .m2-ai-options label {
                display: inline-flex;
                align-items: center;
                margin-right: 15px;
                font-weight: normal;
            }
            .m2-ai-options input[type="checkbox"] {
                margin-right: 5px;
            }
            .m2-ai-options select {
                width: 100%;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                margin-top: 5px;
            }
            .m2-ai-generate-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .m2-ai-generate-btn:hover {
                transform: translateY(-2px);
            }
            .m2-ai-generate-btn:active {
                transform: translateY(0);
            }
            .m2-ai-result {
                margin-top: 20px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .m2-ai-loading {
                text-align: center;
            }
            .m2-ai-spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Tab switching
        modal.querySelectorAll('.m2-ai-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                modal.querySelectorAll('.m2-ai-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabName = this.dataset.tab;
                modal.querySelectorAll('.m2-ai-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                modal.querySelector(`#${tabName}-tab`).style.display = 'block';
            });
        });

        // Store editor reference for generation functions
        window.currentEditor = editor;
        window.currentModal = modal;
    }

    // Generate AI text
    window.generateAIText = async function() {
        const prompt = document.getElementById('text-prompt').value.trim();
        if (!prompt) {
            alert('Please enter a prompt!');
            return;
        }

        const makeLonger = document.getElementById('make-longer').checked;
        const makeProfessional = document.getElementById('make-professional').checked;

        let enhancedPrompt = prompt;
        if (makeLonger) enhancedPrompt += ' Make it detailed and comprehensive.';
        if (makeProfessional) enhancedPrompt += ' Use a professional and polished tone.';

        const resultDiv = document.getElementById('ai-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div class="m2-ai-loading"><div class="m2-ai-spinner"></div><p>AI is generating your text...</p></div>';

        try {
            const response = await callAI('text', enhancedPrompt);
            
            resultDiv.innerHTML = `
                <h3>✨ Generated Text:</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; white-space: pre-wrap;">${response.content}</div>
                <button class="m2-ai-generate-btn" onclick="window.insertGeneratedText('${response.content.replace(/'/g, "\\'")}')">📝 Insert into Page</button>
                <button class="m2-ai-generate-btn" style="background: #6c757d; margin-top: 10px;" onclick="window.generateAIText()">🔄 Regenerate</button>
            `;
        } catch (error) {
            resultDiv.innerHTML = `
                <div style="color: #dc3545; padding: 15px; background: #f8d7da; border-radius: 8px;">
                    <strong>❌ Error:</strong> ${error.message}
                    <br><br>
                    <small>Make sure your API key is configured correctly.</small>
                </div>
            `;
        }
    };

    // Generate AI image
    window.generateAIImage = async function() {
        const prompt = document.getElementById('image-prompt').value.trim();
        if (!prompt) {
            alert('Please describe the image you want!');
            return;
        }

        const style = document.getElementById('image-style').value;
        const enhancedPrompt = style ? `${prompt}, ${style} style` : prompt;

        const resultDiv = document.getElementById('ai-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div class="m2-ai-loading"><div class="m2-ai-spinner"></div><p>AI is generating your image... (this may take 10-30 seconds)</p></div>';

        try {
            const response = await callAI('image', enhancedPrompt);
            
            resultDiv.innerHTML = `
                <h3>🎨 Generated Image:</h3>
                <img src="${response.image_url}" style="width: 100%; border-radius: 8px; margin: 10px 0;" />
                <button class="m2-ai-generate-btn" onclick="window.insertGeneratedImage('${response.image_url}')">📷 Insert into Page</button>
                <button class="m2-ai-generate-btn" style="background: #6c757d; margin-top: 10px;" onclick="window.generateAIImage()">🔄 Regenerate</button>
            `;
        } catch (error) {
            resultDiv.innerHTML = `
                <div style="color: #dc3545; padding: 15px; background: #f8d7da; border-radius: 8px;">
                    <strong>❌ Error:</strong> ${error.message}
                    <br><br>
                    <small>Make sure your API key is configured correctly.</small>
                </div>
            `;
        }
    };

    // Insert generated text into editor
    window.insertGeneratedText = function(text) {
        const editor = window.currentEditor;
        const selected = editor.getSelected();
        
        if (selected && selected.get('type') === 'text') {
            // Update existing text component
            selected.components(text);
        } else {
            // Add new text component
            editor.addComponents({
                type: 'text',
                content: text,
                style: { padding: '10px' }
            });
        }
        
        window.currentModal.remove();
        alert('✅ Text inserted successfully!');
    };

    // Insert generated image into editor
    window.insertGeneratedImage = function(imageUrl) {
        const editor = window.currentEditor;
        const selected = editor.getSelected();
        
        if (selected && selected.get('type') === 'image') {
            // Update existing image
            selected.set('attributes', { src: imageUrl });
        } else {
            // Add new image component
            editor.addComponents({
                type: 'image',
                attributes: { src: imageUrl },
                style: { 'max-width': '100%', 'height': 'auto' }
            });
        }
        
        window.currentModal.remove();
        alert('✅ Image inserted successfully!');
    };

    // Call AI API (text or image generation)
    async function callAI(type, prompt) {
        if (CONFIG.USE_PROXY) {
            // Use Cloudflare Worker proxy (recommended)
            const response = await fetch(CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    prompt: prompt
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } else {
            // Direct OpenAI API call (less secure)
            if (!CONFIG.OPENAI_API_KEY) {
                throw new Error('OpenAI API key not configured. Please set CONFIG.OPENAI_API_KEY or use Cloudflare Worker proxy.');
            }

            if (type === 'text') {
                return await generateTextDirect(prompt);
            } else {
                return await generateImageDirect(prompt);
            }
        }
    }

    // Direct OpenAI text generation
    async function generateTextDirect(prompt) {
        const response = await fetch(`${CONFIG.OPENAI_DIRECT_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.TEXT_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional copywriter helping create content for M2 Studios, a creative studio specializing in dance, photography, and events. Write compelling, engaging content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate text');
        }

        const data = await response.json();
        return {
            content: data.choices[0].message.content
        };
    }

    // Direct OpenAI image generation
    async function generateImageDirect(prompt) {
        const response = await fetch(`${CONFIG.OPENAI_DIRECT_URL}/images/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.IMAGE_MODEL,
                prompt: prompt,
                n: 1,
                size: CONFIG.IMAGE_SIZE,
                quality: CONFIG.IMAGE_QUALITY
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate image');
        }

        const data = await response.json();
        return {
            image_url: data.data[0].url
        };
    }

})();
