export interface Profile {
  id: string;
  name: string;
  nickName: string;
  email: string;
  phone: string;
  imageUrl: string;
  createTime?: Date;
}
export interface Server {
  id: string;
  profileId: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  members?: Member[];
}
export enum ChannelType {
  TEXT = '0',
  AUDIO = '1',
  VIDEO = '2',
}
export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  serverId: string;
}
export interface Conversation {
  id: string;
  memberOne: Member;
  memberTwo: Member;
}

export enum MemberRole {
  ADMIN = '0',
  MODERATOR = '1',
  GUEST = '2',
}

export interface Member {
  id: string;
  name: string;
  profileId: string;
  role: MemberRole;
  profile?: Profile;
}
export interface Message {
  id: string;
  content: string;
  channelId: string;
  memberId: string;
  fileUrl: string | null;
  deleted: string;
  createTime: Date;
  updateTime: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  tags: Tag[];
  answerCount: number;
  author: Profile;
  createTime: Date;
  updateTime: Date;
}

export interface Tag {
  id: string;
  name: string;
  questionCount: number;
  createTime: Date;
  updateTime: Date;
}

export interface Answer {
  id: string;
  profileId: string;
  questionId: string;
  content: string;
  author: Profile;
  upvotes: number;
  downvotes: number;
  hasDownVoted: boolean;
  hasUpVoted: boolean;
  createTime: Date;
  updateTime: Date;
}

export interface Page<T> {
  pageNum: string;
  pageSize: string;
  total: string;
  pages: string;
  list: T[];
}
export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}
