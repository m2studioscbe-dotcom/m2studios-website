// Load page content from GitHub via N8n
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const pageName = url.searchParams.get('page') || 'index';
    
    // Call N8n page_load webhook
    const webhookUrl = 'http://localhost:5678/webhook/c0b4e462-db03-4d80-9c88-ef817e79f733';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageName })
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      content: result.content || '',
      html: result.html || '',
      css: result.css || '',
      pageName: pageName
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
