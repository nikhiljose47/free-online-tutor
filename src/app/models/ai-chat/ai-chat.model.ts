export type AiRole = 'system' | 'user' | 'assistant';

export type AiModelType = 'theory' | 'solving' | 'images';

export interface AiChatMessage {
  role: AiRole;
  content: string;
}

export interface AiGatewayRequest {
  system: string;
  question: string;
  context?: string;
  modelType?: AiModelType;
  priority?: 'low' | 'medium' | 'high';
}
