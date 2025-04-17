export interface chunkData {
  stageTitle: string;
  stageContent: string;
  showType?: string;
  sqlData?: sqlData;
}
export interface streamChatArray {
  messageType: number;
  content: string;
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

const suggestedQuestions = [
  'Top 2 cities with the number of users yesterday',
  'Show me the Data traffic and Voice traffic indicators of Riyadh and Jeddah on Sunday.',
  'How about Voice quality in Jeddah yesterday?',
  'What is the value of Perceived Call SR at Jeddah in last 7 days?',
  'I need to query each kind of data traffic in Riyadh',
  'Please check the video data traffic in Riyadh in the last 3 days?',
  'How many STC Application users are there in Riyadh in last week?',
  'Please describe PDP_CREATE_SUCCESS_RATE at jeddah in last week ?',
  'What is the value of WEB TCP Connection Success Rate at Riyadh at 07:00 ?',
];

export default suggestedQuestions;
