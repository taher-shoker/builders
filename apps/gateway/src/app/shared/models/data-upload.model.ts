export type SourceType = 'monthly' | 'lookup';

export interface Option {
  id: number;
  name: number;
}

export interface UploadedFile {
  endTime: Date;
  executedBy: string;
  jobCategory: string;
  jobId: number;
  parameters: string;
  sourceSubsidiaryName: string;
  startTime: Date;
  status: string;
}
