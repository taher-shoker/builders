export interface chunkData {
  stageTitle: string;
  stageContent: string;
  showType?: string;
  sqlData?: sqlData;
  previousContent?: string;
  newChunk?: string;
}
export interface streamChatArray {
  messageType: number;
  content: string;
  header?: string;
  newChat?: boolean;
  date?: string;
  chunk?: chunkData[];
}

export interface responseBody {
  data: data | null;
  message: string;
  resultCode: string;
  timestamp: string;
}
export interface sqlData {
  xList: any[];
  yList: any[];
  data?: any[];
  title: string;
  rows?: any[];
  yListKey?: string;
}
export interface chatBody {
  content: string;
  showType?: string;
  conversationUUID: string;
}

export interface data {
  confidence: number;
  content: string;
  showType: string;
  sqlData: sqlData;
  images?: string[];
}

export interface chatArray {
  content: string;
  date: string;
  messageType: number;
  images?: string[];
  showType?: string;
  sqlData?: sqlData;
}
