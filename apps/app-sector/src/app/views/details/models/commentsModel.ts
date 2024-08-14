export interface commentEditBody {
  id: number;
  comment: string;
}
export interface addreplyBody {
  commentId: number;
  reply: string;
}
export interface replyEditBody {
  id: number;
  reply: string;
}
export interface reply {
  id: number;
  createdAt: string;
  editedAt: string;
  authorId: number;
  authorName: string;
  reply: string;
  edited: boolean;
}
export interface comment {
  id: number;
  kpiCode: string;
  comment: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  editedAt: string;
  edited: boolean;
  replies: reply[];
}

// To be removed
export interface myReply {
  name: string;
  mentions: string[];
  comment: string;
  time: string;
}
export interface myComment {
  name: string;
  mentions: string[];
  comment: string;
  time: string;
  replies: myReply[];
}
