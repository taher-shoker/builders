export interface user {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  index?: number;
}
export interface notificationBody {
  commentId: number;
  mentioner: user;
  mentionedList: user[];
  content: string;
}
export interface sectorUsersParams {
  system: string;
  team: string;
}
export interface addCommentBody {
  sectorName: string;
  year: number;
  quarter: string;
  scorecardTitle: string;
  kpiCode: string;
  comment: string;
  commaSeparatedMentions: string | null;
}

export interface commentEditBody {
  id: number;
  comment: string;
  commaSeparatedMentions?: string | null;
}
export interface addreplyBody {
  commentId: number;
  reply: string;
  commaSeparatedMentions?: string | null;
}
export interface replyEditBody {
  id: number;
  reply: string;
  commaSeparatedMentions?: string | null;
}
export interface reply {
  id: number;
  createdAt: string;
  editedAt: string;
  authorId: number;
  authorName: string;
  reply: string;
  edited: boolean;
  commaSeparatedMentions: string | null;
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
  commaSeparatedMentions: string | null;
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
