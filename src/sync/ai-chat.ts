// AI Chat domain API types

export interface ConversationInfo {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface ChatMessageInfo {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming: boolean;
}

// ai.conversations
export interface AiConversationsRequest {}
export interface AiConversationsResponse {
  conversations: ConversationInfo[];
}

// ai.history
export interface AiHistoryRequest {
  conversationId: string;
  limit?: number;
  offset?: number;
}
export interface AiHistoryResponse {
  messages: ChatMessageInfo[];
  total: number;
}

// ai.send
export interface AiSendRequest {
  conversationId?: string;
  message: string;
  context?: Record<string, unknown>;
}
export interface AiSendResponse {
  conversationId: string;
  messageId: string;
}

// ai.cancel
export interface AiCancelRequest {
  conversationId: string;
}
export interface AiCancelResponse {
  success: boolean;
}

// ai.onMessage (event)
export interface AiMessageEvent {
  conversationId: string;
  message: ChatMessageInfo;
}

// ai.onStream (event — partial content updates)
export interface AiStreamEvent {
  conversationId: string;
  messageId: string;
  delta: string;
}

// ai.onAction (event — agent tool calls that produce change proposals)
export interface AiActionEvent {
  conversationId: string;
  action: 'file_edit' | 'file_create' | 'file_delete' | 'terminal_run';
  proposalId?: string;
  details: Record<string, unknown>;
}
