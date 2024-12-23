export interface responseBody {
  data: data | null;
  message: string;
  resultCode: string;
  timestamp: string;
}
export interface data {
  confidence: number;
  content: string;
  images: string[];
}
export interface chatBody {
  content: string;
}
export interface chatArray {
  content: string;
  date: string;
  messageType: number;
  images?: string[];
}
