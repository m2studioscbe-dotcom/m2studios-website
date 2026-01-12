// Generate AI content using OpenAI API
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    const openaiKey = env.OPENAI_API_KEY;
    if (!openaiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Prepare system prompt based on type
    let systemPrompt = 'You are a helpful AI assistant for web design and content creation.';
    const type = body.type || 'general';
    
    if (type === 'hero') {
      systemPrompt = 'You are an expert web designer. Generate modern, engaging hero section content with compelling headlines and CTAs.';
    } else if (type === 'features') {
      systemPrompt = 'You are an expert at creating feature sections. Generate clear, benefit-focused feature descriptions.';
    } else if (type === 'about') {
      systemPrompt = 'You are an expert copywriter. Create authentic, engaging About section content.';
    } else if (type === 'contact') {
      systemPrompt = 'You are an expert at creating contact sections. Generate welcoming, action-oriented contact content.';
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: body.prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      return new Response(JSON.stringify({
        success: false,
        error: 'AI generation failed',
        details: error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await openaiResponse.json();
    const generatedContent = data.choices[0].message.content;

    // Log to N8n for tracking (don't fail if this fails)
    try {
      const logWebhook = env.N8N_AI_GENERATE_WEBHOOK;
      if (logWebhook) {
          await fetch(logWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: body.prompt,
            type,
            content: generatedContent,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (n8nError) {
      console.error('N8n logging failed:', n8nError);
    }
    
    return new Response(JSON.stringify({
      success: true,
      content: generatedContent,
      metadata: { type, model: 'gpt-4' }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
