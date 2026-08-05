export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'true_false';

export interface Question {
  id: string;
  subjectId: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number; // 0-indexed option index
  explanation: string;
  difficulty: Difficulty;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // FontAwesome class or Lucide icon name
  description: string;
  questionsCount: number;
  color: string;
}

export interface Session {
  id: string;
  subjectId: string;
  subjectName?: string;
  score: number; // percentage or points
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // seconds
  date: string; // ISO string
}

export interface Progress {
  totalAttempts: number;
  averageScore: number;
  streakDays: number;
  weakTopics: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  autoSave: boolean;
  selectedModel: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  format: 'PDF' | 'DOCX' | 'ZIP' | 'PPTX' | 'VIDEO' | 'LINK';
  size?: string;
  url: string;
  dateAdded: string;
}

export interface BoardPost {
  id: string;
  author: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple';
  timestamp: string;
  likes: number;
  reply?: string;
}

export interface Mindmap {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  chapter: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  chapter: string;
}

export interface InfoPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export interface AppData {
  subjects: Subject[];
  questions: Question[];
  sessions: Session[];
  progress: Progress;
  settings: Settings;
  boardPosts?: BoardPost[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Web' | 'AI' | 'Mobile' | 'Cloud';
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  image: string;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  period: string;
  degree: string;
  school: string;
  gpa: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  usedModel?: string;
  imageBase64?: string;
}
