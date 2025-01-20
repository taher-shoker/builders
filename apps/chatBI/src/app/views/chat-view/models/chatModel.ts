export interface responseBody {
  data: data | null;
  message: string;
  resultCode: string;
  timestamp: string;
}
export interface data {
  confidence: number;
  content: string;
  showType: string;
  sqlData: sqlData;
  images?: string[];
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
}
export interface chatArray {
  content: string;
  date: string;
  messageType: number;
  images?: string[];
  showType?: string;
  sqlData?: sqlData;
}
