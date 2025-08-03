export interface ticketCount {
  total: number;
  issue: number;
  feedback: number;
}
export interface feedbackIssuesAttachment {
  id: number;
  attachmentType: string;
  fileName: string;
  url: string;
  label: string;
  note: string;
  uploadDate: string;
}
export interface formBody {
  type: string;
  title: string;
  description: string;
  attachmentIds: number[];
}
export interface attachments {
  attachmentId: number;
  attachmentName: string;
}
export interface content {
  id: number;
  type: string;
  description: string;
  createdBy: string;
  createDate: string;
  isResolved: boolean;
  attachments: attachments[];
}
export interface logsResponse {
  content: content[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
