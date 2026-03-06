// Projects domain API types

export interface ProjectDescriptor {
  id: string;
  name: string;
  path: string;
  isOpen: boolean;
}

// projects.list
export interface ProjectsListRequest {}
export interface ProjectsListResponse {
  projects: ProjectDescriptor[];
}

// projects.open
export interface ProjectsOpenRequest {
  path: string;
  name?: string;
}
export interface ProjectsOpenResponse {
  project: ProjectDescriptor;
}

// projects.close
export interface ProjectsCloseRequest {
  projectId: string;
}
export interface ProjectsCloseResponse {
  success: boolean;
}

// projects.active
export interface ProjectsActiveRequest {}
export interface ProjectsActiveResponse {
  project: ProjectDescriptor | null;
}

// projects.setActive
export interface ProjectsSetActiveRequest {
  projectId: string;
}
export interface ProjectsSetActiveResponse {
  success: boolean;
}

// projects.onChanged (event)
export interface ProjectsChangedEvent {
  type: 'added' | 'removed' | 'activated';
  project: ProjectDescriptor;
}
