export interface Standard {
  id: string;
  standardId: string;
  name: string;
  version: string;
  lastUpdate: Date | null;
  publishUpdate: Date | null;
  businessArea: string;
  type: string;
  domain: string;
  iprMode: string;
  overView: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GetStandardsResponse {
  standardDtoList: Standard[];
}

export interface CreateStandardRequest {
  version: string;
  lastUpdate: string;
  publishUpdate: string;
  businessArea: string;
  type: string;
  domain: string;
  iprMode: string;
  overView: string;
  name: string;
  standardId: string;
  file: File;
}

export interface ErrorResponse {
  error: string;
}
