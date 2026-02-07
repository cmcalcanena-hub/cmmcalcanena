
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: 'trainer' | 'student';
}

export interface ContactMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  priority: 'normal' | 'high';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // IDs dos usuários que curtiram
  comments: Comment[];
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface TrainingLog {
  id: string;
  date: string;
  exercise: string;
  result: string; // "Marca" substituindo peso e reps
}

export interface Student {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  startYear: number;
  evolution: TrainingLog[];
  attendance: string[]; // Datas formatadas YYYY-MM-DD
  location: 'Alcanena' | 'Minde';
}

export enum ViewState {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  FEED = 'FEED',
  MODERATION = 'MODERATION',
  ATTENDANCE = 'ATTENDANCE',
  INFO = 'INFO',
  ABOUT = 'ABOUT'
}

export interface AppPlan {
  name: string;
  tagline: string;
  targetAudience: string;
  businessModel: string;
  keyFeatures: { title: string; description: string; }[];
  techStack: { category: string; suggestion: string; reasoning: string; }[];
  mvpSteps: string[];
}
