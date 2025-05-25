export interface sqlData {
  xList: any[];
  yList: any[];
  data?: any[];
  title: string;
  rows?: any[];
  yListKey?: string;
  xListKey?: string;
}
export interface chatBody {
  content: string;
  showType?: string;
}
export interface chatArray {
  messageType: string;
  content: string;
  header?: string;
  newChat?: boolean;
  date?: string;
  showType?: string;
  sqlData?: sqlData;
  sqlQuery?: any;
  sqlReason?: any;
}
export interface responseBody {
  data: responseData;
  message: string | null;
  resultCode: number;
  timestamp: string;
}
export interface responseData {
  content: string;
  showType: string | null;
  sqlData: sqlData | null;
  sqlQuery: string | null;
  sqlReason: string | null;
}
