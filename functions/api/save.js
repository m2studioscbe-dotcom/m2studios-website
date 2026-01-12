// Save page content to GitHub via N8n
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    // Call N8n page_save webhook
    const webhookUrl = 'http://localhost:5678/webhook/cf2978cb-b520-4435-b2a7-dcf971f58a31';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageName: body.pageName || 'index',
        content: body.content,
        html: body.html,
        css: body.css,
        timestamp: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Page saved successfully',
      data: result
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
