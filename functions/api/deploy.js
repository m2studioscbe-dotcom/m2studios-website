// Trigger Cloudflare deployment via N8n
export async function onRequestPost(context) {
  try {
    // Call N8n deploy_trigger webhook
    const webhookUrl = 'http://localhost:5678/webhook/e9d3eb31-55bb-489a-8893-f09cf70296a2';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger: 'manual',
        timestamp: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Deployment triggered successfully',
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
