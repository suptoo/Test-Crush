// API Configuration for TestCrush AI
// Replace '0' with actual API keys when ready

export const AI_CONFIG = {
  qwen: {
    apiKey: process.env.QWEN_API_KEY || '0',
    endpoint: 'https://api.qwen.ai/v1',
    model: 'qwen-turbo',
    capabilities: ['video', 'audio', 'image', 'text']
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '0',
    endpoint: 'https://generativelanguage.googleapis.com/v1',
    model: 'gemini-pro',
    capabilities: ['pdf', 'text', 'image', 'vision']
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY || '0',
    endpoint: 'https://api.mistral.ai/v1',
    model: 'mistral-medium',
    capabilities: ['text', 'summarization']
  },
  chatgpt: {
    apiKey: process.env.OPENAI_API_KEY || '0',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4',
    capabilities: ['text', 'reasoning', 'code']
  },
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY || '0',
    endpoint: 'https://api.perplexity.ai',
    model: 'pplx-70b-online',
    capabilities: ['search', 'research', 'web']
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY || '0',
    endpoint: 'https://api.anthropic.com/v1',
    model: 'claude-3-opus',
    capabilities: ['text', 'analysis', 'reasoning']
  }
}

export type AIModelType = keyof typeof AI_CONFIG

export interface AIRequest {
  model: AIModelType
  inputType: 'text' | 'pdf' | 'image' | 'video' | 'audio'
  content: string
  file?: File
  options?: {
    temperature?: number
    maxTokens?: number
    outputFormat?: 'text' | 'audio' | 'video' | 'image'
  }
}

export interface AIResponse {
  success: boolean
  model: AIModelType
  content: string
  outputType: 'text' | 'audio' | 'video' | 'image'
  metadata?: {
    tokensUsed?: number
    processingTime?: number
    confidence?: number
  }
  error?: string
}
