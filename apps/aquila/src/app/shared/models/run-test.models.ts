export interface RunTestRequest {
  apiUrl: string;
  standardId: string;
  version: string;
}

export interface RunTestResponse {
  data: {
    parentTestId: string;
    ApiName: string;
    standardName: string;
    testStatus: string;
    summaryFileJson: string;
    summaryFileHtml: string;
    result: {
      testId: string;
      description: string;
      result: string;
      recommendation: string;
    }[];
  };
}

export interface RunMultipleTestsResponse {
  testResults: TestResult[];
}

export interface TestResult {
  parentTestId: string;
  apiName: string;
  standardName: string;
  testStatus: string | null;
  summaryFileJson: string;
  summaryFileHtml: string;
  totalTests: number;
  totalPasses: number;
  totalFails: number;
  result: string | null;
  errorCode: string | null;
}

export interface QueueItem {
  id: number;
  apiUrl: string;
  standardId: any;
  standardList: any[];
  domain?: string;
  hasRun?: boolean;
  hasCompleted?: boolean;
  hasReload?: boolean;
  date?: Date;
  result?: string;
  parentTestId?: string;
  summaryFileJson?: string;
  summaryFileHtml?: string;
  testStatus?: string;
}
