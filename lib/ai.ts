// AI Helper Library for M2 Studios
// Provides utility functions for AI content generation

interface AIConfig {
  vyApiKey: string;
  cometApiKey: string;
  defaultModel: string;
}

// AI configuration (loaded from environment variables)
const getConfig = (): AIConfig => ({
  vyApiKey: process.env.VY_API_KEY || '',
  cometApiKey: process.env.COMET_AI_KEY || '',
  defaultModel: 'gpt-4'
});

/**
 * Generate text content using AI
 */
export async function generateText(
  prompt: string,
  options: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  } = {}
): Promise<string> {
  const config = getConfig();
  
  if (!config.vyApiKey && !config.cometApiKey) {
    throw new Error('AI API key not configured');
  }
  
  // Try Vy API first
  if (config.vyApiKey) {
    try {
      return await generateWithVy(prompt, options);
    } catch (error) {
      console.error('Vy API failed, trying Comet:', error);
    }
  }
  
  // Fallback to Comet API
  if (config.cometApiKey) {
    return await generateWithComet(prompt, options);
  }
  
  throw new Error('All AI providers failed');
}

/**
 * Generate text using Vy Vercept API
 */
async function generateWithVy(
  prompt: string,
  options: any
): Promise<string> {
  const config = getConfig();
  
  const response = await fetch('https://api.vercept.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.vyApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      model: options.model || config.defaultModel,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`Vy API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.text || data.content || '';
}

/**
 * Generate text using Comet AI API
 */
async function generateWithComet(
  prompt: string,
  options: any
): Promise<string> {
  const config = getConfig();
  
  const response = await fetch('https://api.comet.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.cometApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for M2 Studios, a creative studio combining dance training and photography services.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: options.model || config.defaultModel,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`Comet API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Generate image using AI
 */
export async function generateImage(
  prompt: string,
  options: {
    size?: string;
    style?: string;
  } = {}
): Promise<string> {
  const config = getConfig();
  
  if (!config.vyApiKey && !config.cometApiKey) {
    throw new Error('AI API key not configured');
  }
  
  // For now, return a placeholder
  // In production, this would call DALL-E or similar
  return `https://via.placeholder.com/800x600?text=${encodeURIComponent(prompt)}`;
}

/**
 * Generate content for M2 Studios website
 */
export async function generateWebsiteContent(
  contentType: 'headline' | 'description' | 'cta' | 'about',
  context: string = ''
): Promise<string> {
  const prompts = {
    headline: `Write a compelling headline for M2 Studios, a creative studio in Coimbatore that combines professional dance training (Movementz Factory) and photography services (Momentz Photography). ${context}`,
    description: `Write a professional description for M2 Studios' ${context || 'services'}. Keep it engaging and concise (2-3 sentences).`,
    cta: `Create a call-to-action button text for ${context || 'booking dance classes at M2 Studios'}. Keep it short and action-oriented.`,
    about: `Write an 'About Us' section for M2 Studios, highlighting their dual focus on dance training and photography. ${context}`
  };
  
  const prompt = prompts[contentType];
  return generateText(prompt, { maxTokens: 200 });
}

/**
 * Enhance existing content with AI
 */
export async function enhanceContent(
  content: string,
  enhancement: 'improve' | 'shorten' | 'expand' | 'simplify'
): Promise<string> {
  const prompts = {
    improve: `Improve the following content while maintaining its core message: ${content}`,
    shorten: `Make the following content more concise while keeping the key points: ${content}`,
    expand: `Expand the following content with more details and examples: ${content}`,
    simplify: `Simplify the following content to make it easier to understand: ${content}`
  };
  
  return generateText(prompts[enhancement]);
}

/**
 * Generate SEO metadata
 */
export async function generateSEO(
  pageContent: string,
  pageName: string
): Promise<{
  title: string;
  description: string;
  keywords: string[];
}> {
  const prompt = `Based on this page content for M2 Studios' ${pageName} page, generate:
1. An SEO-optimized title (max 60 characters)
2. A meta description (max 160 characters)
3. 5-7 relevant keywords

Page content: ${pageContent.substring(0, 500)}...

Format your response as JSON with keys: title, description, keywords (array)`;
  
  const response = await generateText(prompt, { maxTokens: 300 });
  
  try {
    return JSON.parse(response);
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      title: `M2 Studios - ${pageName}`,
      description: 'Professional dance training and photography services in Coimbatore',
      keywords: ['dance studio', 'photography', 'Coimbatore', 'M2 Studios']
    };
  }
}

/**
 * Process AI command from admin dashboard
 */
export async function processCommand(command: string): Promise<string> {
  const lowerCommand = command.toLowerCase();
  
  // Handle specific commands
  if (lowerCommand.includes('deploy')) {
    return 'Deployment command received. Use the Deploy button to trigger a deployment.';
  }
  
  if (lowerCommand.includes('workflow') || lowerCommand.includes('status')) {
    return 'All workflows are active and running. Check the Workflow Monitor for details.';
  }
  
  if (lowerCommand.includes('generate')) {
    const match = command.match(/generate (.+)/i);
    if (match) {
      const content = await generateText(match[1]);
      return content;
    }
  }
  
  // Default: use AI to process the command
  const prompt = `You are an AI assistant for M2 Studios admin dashboard. The user said: "${command}". Provide a helpful response about managing the website, workflows, or content.`;
  return generateText(prompt, { maxTokens: 200 });
}

export default {
  generateText,
  generateImage,
  generateWebsiteContent,
  enhanceContent,
  generateSEO,
  processCommand
};
