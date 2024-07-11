export interface NewReport {
  attachment: number;
  reportName: string;
  requestApprovals: {
    sequence: number;
    username: string;
  };
}

export interface EditReport {
  requestApproval: {
    requestTaskId: number;
    username: string;
  };
  requestId: number;
}

export interface EditReportResponse {
  id: number;
  username: string;
  sequence: number;
  status: 'pending';
  userDisplayName: string;
}

export interface Column {
  key: string;
  type: string;
  label: string;
}

export interface FilterData {
  page: number;
  requestStatus?: string;
  reportName?: string;
  serialNumber?: string;
}

export interface ReportsResponse {
  content: Report[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Attachment {
  fileLabel: string;
  fileName: string;
  id: number;
}

export interface Report {
  attachment: Attachment;
  creatorDisplayName: string;
  creatorEmail: string;
  flowId: number;
  id: number;
  lastModifiedDate: Date;
  remainingSteps: number;
  reportFlowStatus: string;
  reportName: string;
  serialNumber: string;
  requestApprovals: RequestApproval[];
}
export interface RequestApproval {
  completedDate: Date;
  createdDate: Date;
  id: number;
  lastModified: Date;
  requestTaskAttributes: { name: ParamNames; value: ParamTypes }[];
  requestTaskId: number;
  sequence: number;
  status: string;
  userDisplayName: string;
  username: string;
}

export interface PendingReport {
  id: number;
  externalSystemId: number;
  taskName: string;
  taskStatus: string;
  assignedUser: string;
  flowId: number;
  params: Param[];
  createdDate: Date;
  lastModified: Date;
  requestParams: RequestParam;
}

export interface PendingTaskResponse {
  assignedUser: string;
  assignedUserDisplayName: string;
  completedByName: string;
  completedDate: Date;
  createdDate: Date;
  id: number;
  lastModified: Date;
  requestTaskAttributes: { name: ParamNames; value: ParamTypes }[];
  taskName: string;
  taskStatus: 'completed' | 'pending' | 'rejected';
}

export interface PendingTaskRequest {
  requestParams: { name: ParamNames; value: ParamTypes }[];
}

interface Param {
  name: ParamNames;
  type: ParamTypes;
  constraints: Constraint[];
}

interface Constraint {
  name: string;
  configuration: configuration;
}

interface RequestParam {
  creator_display_name: string;
  creator_email: string;
  report_name: string;
  serial_number: string;
}

// Types

type configuration = 'true' | 'false';

type ParamNames = 'isApproved' | 'attachment' | 'comment';

type ParamTypes = boolean | string | number;
