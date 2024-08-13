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
  id: number;
  fileName: string;
  label: string;
}

export interface Report {
  attachments: Attachment[];
  id: number;
  requestCategory: RequestCategory;
  requestApprovals: RequestApproval[];
  creatorEmail: string;
  initiatorEmail: string;
  creatorDisplayName: string;
  flowId: number;
  reportFlowStatus: string;
  currentAssignee: CurrentAssignee[];
  createdDate: string;
  lastModifiedDate: string;
  remainingSteps: number;
  serialNumber: string;
  reportName: string;
  slaDurationInDays: number;
  description: string | null;
  reportSlaDuration: number;
}
export interface CurrentAssignee {
  username: string;
  status: string;
  userDisplayName: string;
  requestTaskId: number;
  createdDate: string;
  lastModified: string;
}
export interface RequestCategory {
  id: number;
  name: string;
  slaDuration: number;
  isDeletable: boolean | null;
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
