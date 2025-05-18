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
  messageType: string;
  content: string;
  header?: string;
  newChat?: boolean;
  date?: string;
  showType?: string;
  sqlData?: sqlData;
}
