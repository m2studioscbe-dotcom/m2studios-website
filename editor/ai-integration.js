// M2 Studios AI Integration for GrapesJS Editor
// Connects to n8n workflow for text and image generation

(function() {
    // Create AI button
    const aiButton = document.createElement('button');
    aiButton.innerText = '🤖 AI';
    aiButton.id = 'ai-panel-button';
    aiButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: transform 0.2s;
    `;
    
    aiButton.addEventListener('mouseenter', () => {
        aiButton.style.transform = 'scale(1.05)';
    });
    
    aiButton.addEventListener('mouseleave', () => {
        aiButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(aiButton);

    // AI button click handler
    aiButton.addEventListener('click', async () => {
        const userPrompt = prompt("Enter your AI prompt:\n\nFor text: 'Generate a description for...'\nFor images: 'Create an image of...'");
        
        if (!userPrompt || userPrompt.trim() === '') {
            return;
        }

        // Determine if request is for text or image
        const isImageRequest = userPrompt.toLowerCase().includes('image') || 
                              userPrompt.toLowerCase().includes('picture') ||
                              userPrompt.toLowerCase().includes('photo') ||
                              userPrompt.toLowerCase().includes('create');
        
        const requestType = isImageRequest ? 'image' : 'text';

        // Show loading state
        aiButton.disabled = true;
        aiButton.innerText = '⏳ Processing...';

        try {
            // Call n8n webhook
            const response = await fetch('https://m2studios-app.n8n.cloud/webhook-test/m2-ai-editor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: requestType,
                    prompt: userPrompt
                })
            });

            const data = await response.json();

            // Get the selected component in GrapesJS editor
            const selected = window.editor.getSelected();

            if (requestType === 'text') {
                // Insert generated text
                if (selected) {
                    selected.set('content', data.content || data.generated_text || 'AI generation failed');
                } else {
                    alert('Generated text: ' + (data.content || data.generated_text));
                }
            } else if (requestType === 'image') {
                // Insert generated image
                if (selected && selected.get('type') === 'image') {
                    selected.set('attributes', { src: data.content || data.image_url });
                } else {
                    // Add new image component
                    window.editor.addComponents({
                        type: 'image',
                        attributes: { src: data.content || data.image_url }
                    });
                }
            }

            alert('AI content generated successfully!');

        } catch (error) {
            console.error('AI generation error:', error);
            alert('Error generating AI content. Please try again.');
        } finally {
            // Reset button state
            aiButton.disabled = false;
            aiButton.innerText = '🤖 AI';
        }
    });

    console.log('M2 Studios AI Integration loaded successfully!');
})();
