// Generate AI content via N8n
export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    
    // Call N8n ai_generate webhook
    const webhookUrl = 'http://localhost:5678/webhook/0c44b279-6a34-4865-9fef-82365e5fc065';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: body.prompt,
        type: body.type || 'content',
        context: body.context || {}
      })
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      content: result.content || result.response || 'AI response generated',
      metadata: result.metadata || {}
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
