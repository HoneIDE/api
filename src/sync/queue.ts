// Changes Queue types

export type TrustLevel = 'review' | 'auto-accept-clean' | 'auto-accept-all' | 'block';

export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'undone';

export type FileChangeType = 'modify' | 'create' | 'delete' | 'rename';

export type ConflictState = 'none' | 'resolved' | 'unresolved';

export interface SourceDescriptor {
  deviceId: string;
  deviceName: string;
  platform: string;
  userId?: string;
}

export interface FileChange {
  type: FileChangeType;
  path: string;
  oldPath?: string;       // for rename
  diff?: string;          // unified diff for modify
  content?: string;       // full content for create
  baseHash?: string;      // hash of the file at the time of the change
}

export interface ChangeProposal {
  id: string;
  source: SourceDescriptor;
  timestamp: string;        // ISO 8601
  projectId: string;
  files: FileChange[];
  description: string;
  context?: Record<string, unknown>;
  status: ProposalStatus;
  groupId?: string;
  conflict: ConflictState;
}

export interface QueueDecision {
  proposalId: string;
  action: 'accepted' | 'rejected' | 'undone';
  timestamp: string;
  reverseDiffs?: Map<string, string>;  // path → reverse diff for undo
}

export interface EnqueueResult {
  proposal: ChangeProposal;
  autoAccepted: boolean;
}

export interface AcceptResult {
  proposalId: string;
  success: boolean;
  filesModified: string[];
  error?: string;
}

export interface UndoResult {
  undoneCount: number;
  proposals: string[];
  conflicts: string[];
}
