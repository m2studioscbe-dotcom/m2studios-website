// N8n Helper Library for M2 Studios
// Provides utility functions for interacting with N8n webhooks

interface N8nWebhookConfig {
  baseUrl: string;
  webhooks: {
    page_save: string;
    page_load: string;
    deploy_trigger: string;
    ai_generate: string;
    log_sync: string;
  };
}

// N8n webhook configuration
const config: N8nWebhookConfig = {
  baseUrl: 'http://localhost:5678/webhook',
  webhooks: {
    page_save: 'cf2978cb-b520-4435-b2a7-dcf971f58a31',
    page_load: '9c5e8f3a-1b2d-4e6f-8a9c-3d4e5f6a7b8c',
    deploy_trigger: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    ai_generate: 'f1e2d3c4-b5a6-9876-5432-1fedcba09876',
    log_sync: 'b9ee5be8-b70d6-4649-a384-38dc726a40f9'
  }
};

/**
 * Get the full webhook URL for a specific workflow
 */
export function getWebhookUrl(workflowName: keyof N8nWebhookConfig['webhooks']): string {
  const webhookId = config.webhooks[workflowName];
  if (!webhookId) {
    throw new Error(`Unknown workflow: ${workflowName}`);
  }
  return `${config.baseUrl}/${webhookId}`;
}

/**
 * Call an N8n webhook with data
 */
export async function callWebhook(
  workflowName: keyof N8nWebhookConfig['webhooks'],
  data: any
): Promise<any> {
  const url = getWebhookUrl(workflowName);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        workflow: workflowName
      })
    });
    
    if (!response.ok) {
      throw new Error(`N8n webhook failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling N8n webhook ${workflowName}:`, error);
    throw error;
  }
}

/**
 * Save page content via N8n
 */
export async function savePage(pageName: string, content: string, html: string, css: string) {
  return callWebhook('page_save', {
    pageName,
    content,
    html,
    css
  });
}

/**
 * Load page content via N8n
 */
export async function loadPage(pageName: string) {
  return callWebhook('page_load', {
    pageName
  });
}

/**
 * Trigger deployment via N8n
 */
export async function triggerDeploy() {
  return callWebhook('deploy_trigger', {
    action: 'deploy',
    environment: 'production'
  });
}

/**
 * Generate AI content via N8n
 */
export async function generateAIContent(prompt: string, mode: 'text' | 'image' = 'text') {
  return callWebhook('ai_generate', {
    prompt,
    mode
  });
}

/**
 * Sync logs via N8n
 */
export async function syncLogs(logData: any) {
  return callWebhook('log_sync', {
    logs: logData
  });
}

/**
 * Get workflow status (mock implementation)
 */
export async function getWorkflowStatus(workflowName: keyof N8nWebhookConfig['webhooks']) {
  // In production, this would call N8n API to get workflow status
  return {
    name: workflowName,
    active: true,
    lastExecution: new Date().toISOString(),
    status: 'success'
  };
}

/**
 * Get all workflows status
 */
export async function getAllWorkflowsStatus() {
  const workflows = Object.keys(config.webhooks) as Array<keyof N8nWebhookConfig['webhooks']>;
  const statuses = await Promise.all(
    workflows.map(workflow => getWorkflowStatus(workflow))
  );
  return statuses;
}

export default {
  getWebhookUrl,
  callWebhook,
  savePage,
  loadPage,
  triggerDeploy,
  generateAIContent,
  syncLogs,
  getWorkflowStatus,
  getAllWorkflowsStatus
};
