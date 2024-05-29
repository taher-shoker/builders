export interface RequestTask {
  requestTaskId: number;
  status: string;
  username: string;
  userDisplayName: string;
  requestTaskAttributes: [
    {
      id: number;
      name: string;
      value: string;
    }
  ];
  completedDate: Date;
  createdDate: Date;
  lastModified: Date;

  params: {
    name: string;
    type: string;
    constraints: [
      {
        name: string;
        configuration: boolean;
      }
    ];
  }[];
}

export interface MilestoneAttachment {
  fileName: string;
  id: number;
  label: string;
  milestone: MilestoneDetails;
  uploadDate: string; // it is a Date in a format of : "2024-3-17"
  url: string;
}

export class Actions {
  static readonly addEvidence = new Actions('Add Evidence', 'Add Evidence');
  static readonly addNewProgress = new Actions(
    'Add New Progress',
    'Add New Progress'
  );
  static readonly addJustification = new Actions(
    'Add Justification',
    'Add Justification'
  );
  static readonly addOnTrack = new Actions('Add Remarks', 'Add Remarks');
  static readonly reviewEvidence = new Actions('Approve Evidence', 'Approve');
  static readonly reviewJustification = new Actions(
    'Approve Justification',
    'Approve'
  );
  static readonly reviewOnTrack = new Actions('Approve on Track', 'Approve');
  static readonly updateDTRecord = new Actions(
    'Update Record',
    'Update Record'
  );
  static readonly initiateUpdateProgress = new Actions(
    'Update progress',
    'Update progress'
  );
  static readonly approveProgress = new Actions(
    'Approve progress',
    'Approve progress'
  );
  static readonly returnProgress = new Actions('Return progress', 'Return');

  static readonly returnJustification = new Actions(
    'Return Justification',
    'Return'
  );
  static readonly returnEvidence = new Actions('Return Evidence', 'Return');
  static readonly returnOnTrack = new Actions('Return Remarks', 'Return');
  static readonly noNeed = new Actions('No Need', 'No Need');

  // private to disallow creating other instances of this type
  private constructor(
    public readonly uniqueTitle: string,
    public readonly displayCaption: string
  ) {}

  toString() {
    return this.uniqueTitle;
  }
}

export interface MilestoneDetails {
  activityName: string | null;
  createdByEmail: string | null;
  createdByName: string | null;
  deliverable: string | null;
  endDate: Date | null;
  id: number | null;
  lastProgressUpdateDate: Date | null;
  milestoneName: string | null;
  startDate: Date | null;
  status: MilestoneStatus | null;
  teamName: string | null;
  updatedByEmail: null | string;
  updatedByName: null | string;
  weight: number | null;
  workingDays: number | null;
  latestApprovedMilestoneProgressUpdate: null | {
    completionImpactRate: string | null;
    cappedCompletionPercentage: string | null;
    targetCompletionLevel: string | null;
    deliverable: string | null;
    isApproved: boolean | null;
    milestoneId: number | null;
    overallProgress: string | null;
    progressUpdateDate: Date | null;
    workflowId: number | null;
    updatedBy: string;
    status: string;
  };
  currentMilestoneProgressUpdateDto: null | {
    completionImpactRate: string | null;
    cappedCompletionPercentage: string | null;
    targetCompletionLevel: string | null;
    deliverable: string | null;
    isApproved: boolean | null;
    milestoneId: number | null;
    overallProgress: string | null;
    progressUpdateDate: Date | null;
    workflowId: number | null;
    updatedBy: string;
    status: string;
  };
}

export interface MilestoneAttachment {
  id: number;
  attachmentType: string;
  fileName: string;
  url: string;
  label: string;
  note: string;
  uploadDate: string;
}

export interface StreamsResponse {
  streams: DTStream[];
  workStreamScore: number;
  year: number;
}

export interface DTStream {
  streamName: string;
  year: number;
  month: number;
  activities: Activity[];
}

export interface Activity {
  activityName: string;
  milestones: {
    milestoneName: string;
    endDate: string;
    status: MilestoneStatus;
    timeSpan?: number;
  }[];
}

export interface HighlightImpactReport {
  year: number;
  team: string;
  valueImpact: string;
  highlight: string;
  baseline: number;
  target: number;
  actual: number;
  targetEoy: number;
}

export interface HighlightImpartReportResponse extends HighlightImpactReport {
  id: number;
  approvalDate: string;
  isApproved: boolean;
  workflowId: number;
  addedBy: string;
}

export interface Reminders {
  id: number;
  reminderContent: string;
  reminderTitle: string;
  reminderUploadDate: string;
}

export type MilestoneProgressWorkflow = MilestoneProgressWorkflowStep[];

export interface MilestoneProgressWorkflowStep {
  requestTaskId: number;
  status: 'completed' | 'pending';
  username: string;
  userDisplayName: string;
  params: {
    constraints: string[];
    name: string;
    type: string;
  }[];
  requestTaskAttributes: {
    id: number;
    name: string;
    value: string;
  }[];
  completedDate: Date;
  createdDate: Date;
  lastModified: Date;
  taskName: string;
  completedByName: string;
}

export type MilestoneStatus = 'Planned' | 'Delayed' | 'On Track' | 'Completed';

export interface PendingTask {
  assignedUser: string;
  createdDate: Date;
  externalSystemId: number;
  flowId: number;
  id: number;
  lastModified: Date;
  params: { name: Actions; type: string; constraints: string[] }[];
  requestParams: {
    creator_username: string;
    milestone_id: string | number;
    milestone_progress_id: string | number;
    team: string;
    status: string;
  };
  taskName: 'Add Remarks';
  taskStatus: 'pending';
}

export type Attachment = {
  id: number;
  fileName: string;
  url: string;
  label: string;
};

export interface ReportData {
  actual: number;
  addedBy: string;
  approvalDate: string | null;
  baseline: number;
  highlight: string;
  id: number;
  isApproved: boolean;
  target: number;
  targetEoy: number;
  team: string;
  valueImpact: string;
  workflowId: number;
  year: number;
}

export interface ReportDataWorkflow {
  completedDate: null | Date;
  createdDate: Date;
  lastModified: Date;
  requestTaskAttributes: [];
  requestTaskId: number;
  status: 'pending' | 'completed';
  taskName: 'Approve Report Data' | 'Edit Report Data';
  userDisplayName: string | null;
  username: string | null;
  params: {
    name: string;
    type: string;
    constraints: { name: string; configuration: string }[];
  }[];
}
export type Params = {
  requestParams: { name: string; value: number | string | boolean }[];
};
