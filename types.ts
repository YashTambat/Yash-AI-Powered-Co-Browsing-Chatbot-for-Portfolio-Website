
export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}


export interface Project {
  id: string;
  category: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  score: string;
  passout: string;
  details: string;
  board?: string;
}

export interface NavigationItem {
  name: string;
  icon: string;
  id: string;
}
