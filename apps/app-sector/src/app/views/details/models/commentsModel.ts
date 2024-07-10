export interface reply {
  name: string;
  mentions: string[];
  comment: string;
  time: string;
}
export interface comment {
  name: string;
  mentions: string[];
  comment: string;
  time: string;
  replies: reply[];
}
