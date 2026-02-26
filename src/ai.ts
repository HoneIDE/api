import { Disposable, CancellationToken } from './types';

// === AI Provider Adapter ===

/**
 * Interface that AI providers implement to integrate with Hone.
 * Extensions can register custom providers (e.g., corporate LLM endpoints).
 */
export interface AIProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly capabilities: AICapabilities;

  /** Stream a completion (for inline ghost text / FIM) */
  complete(request: CompletionRequest, token?: CancellationToken): AsyncIterable<CompletionChunk>;

  /** Stream a chat response */
  chat(request: ChatRequest, token?: CancellationToken): AsyncIterable<ChatChunk>;

  /** Stream a chat response with tool use support (for agent mode) */
  chatWithTools(request: ToolChatRequest, token?: CancellationToken): AsyncIterable<ToolChatChunk>;
}

export interface AICapabilities {
  maxContextTokens: number;
  supportsStreaming: boolean;
  supportsToolUse: boolean;
  supportsVision: boolean;
  supportsFIM: boolean;
  estimatedLatencyMs: number;
}

// === Completion (Ghost Text / FIM) ===

export interface CompletionRequest {
  prompt: string;
  suffix?: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
  model?: string;
}

export interface CompletionChunk {
  text: string;
  done: boolean;
}

// === Chat ===

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatContentPart[];
}

export interface ChatContentPart {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  mimeType?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
}

export interface ChatChunk {
  text: string;
  done: boolean;
  usage?: TokenUsage;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// === Tool Use (Agent Mode) ===

export interface AgentToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;  // JSON Schema
  requiresApproval: boolean;
}

export interface ToolChatRequest extends ChatRequest {
  tools: AgentToolDefinition[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  content: string;
  isError?: boolean;
}

export interface ToolChatChunk {
  type: 'text' | 'tool_call' | 'tool_result_request';
  text?: string;
  toolCall?: ToolCall;
  done: boolean;
  usage?: TokenUsage;
}

// === AI Namespace ===

export declare namespace ai {
  /** Register a custom AI provider adapter */
  function registerAIProvider(provider: AIProviderAdapter): Disposable;

  /** Register a custom agent tool */
  function registerAgentTool(tool: AgentToolDefinition & { execute: (args: Record<string, any>) => Promise<string> }): Disposable;

  /** Get the currently active AI provider (user's configured default) */
  function getActiveProvider(): AIProviderAdapter | null;

  /** List all registered providers */
  function getProviders(): AIProviderAdapter[];
}
