// Sync API message envelope and domain types

export type ApiDomain = 'projects' | 'files' | 'editor' | 'ai' | 'build' | 'run';

export type MessageType = 'request' | 'response' | 'event';

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiMessage {
  id: string;
  type: MessageType;
  domain: ApiDomain;
  operation: string;
  payload: Record<string, unknown>;
  error?: ApiError;
}

export function createRequest(id: string, domain: ApiDomain, operation: string, payload: Record<string, unknown>): ApiMessage {
  return { id, type: 'request', domain, operation, payload };
}

export function createResponse(id: string, domain: ApiDomain, operation: string, payload: Record<string, unknown>): ApiMessage {
  return { id, type: 'response', domain, operation, payload };
}

export function createErrorResponse(id: string, domain: ApiDomain, operation: string, error: ApiError): ApiMessage {
  return { id, type: 'response', domain, operation, payload: {}, error };
}

export function createEvent(id: string, domain: ApiDomain, operation: string, payload: Record<string, unknown>): ApiMessage {
  return { id, type: 'event', domain, operation, payload };
}
