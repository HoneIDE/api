// Build & Run domain API types

// build.start
export interface BuildStartRequest {
  projectId: string;
  taskName?: string;
  args?: string[];
}
export interface BuildStartResponse {
  executionId: string;
}

// build.cancel
export interface BuildCancelRequest {
  executionId: string;
}
export interface BuildCancelResponse {
  success: boolean;
}

// build.status
export interface BuildStatusRequest {
  executionId: string;
}
export interface BuildStatusResponse {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  exitCode: number | null;
}

// build.log
export interface BuildLogRequest {
  executionId: string;
  offset?: number;
  limit?: number;
}
export interface BuildLogResponse {
  output: string;
  isComplete: boolean;
}

// build.onProgress (event)
export interface BuildProgressEvent {
  executionId: string;
  status: 'started' | 'output' | 'completed' | 'failed';
  data?: string;
  exitCode?: number;
}

// run.start
export interface RunStartRequest {
  projectId: string;
  command: string;
  args?: string[];
  cwd?: string;
}
export interface RunStartResponse {
  executionId: string;
}

// run.stop
export interface RunStopRequest {
  executionId: string;
}
export interface RunStopResponse {
  success: boolean;
}

// run.onOutput (event)
export interface RunOutputEvent {
  executionId: string;
  stream: 'stdout' | 'stderr';
  data: string;
}
