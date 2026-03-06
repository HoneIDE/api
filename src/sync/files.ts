// Files domain API types

export interface FileTreeEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeEntry[];
}

// files.tree
export interface FilesTreeRequest {
  projectId: string;
  path?: string;
  depth?: number;
}
export interface FilesTreeResponse {
  entries: FileTreeEntry[];
}

// files.read
export interface FilesReadRequest {
  projectId: string;
  path: string;
}
export interface FilesReadResponse {
  content: string;
  hash: string;
  encoding: string;
}

// files.write
export interface FilesWriteRequest {
  projectId: string;
  path: string;
  content: string;
  baseHash?: string;
}
export interface FilesWriteResponse {
  hash: string;
  success: boolean;
}

// files.patch
export interface FilesPatchRequest {
  projectId: string;
  path: string;
  diff: string;
  baseHash?: string;
}
export interface FilesPatchResponse {
  hash: string;
  success: boolean;
}

// files.delete
export interface FilesDeleteRequest {
  projectId: string;
  path: string;
}
export interface FilesDeleteResponse {
  success: boolean;
}

// files.move
export interface FilesMoveRequest {
  projectId: string;
  oldPath: string;
  newPath: string;
}
export interface FilesMoveResponse {
  success: boolean;
}

// files.onChanged (event)
export interface FilesChangedEvent {
  projectId: string;
  changes: Array<{
    type: 'created' | 'modified' | 'deleted' | 'renamed';
    path: string;
    oldPath?: string;
  }>;
}
