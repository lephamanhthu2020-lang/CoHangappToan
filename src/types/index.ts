export type WorldId = 'smart-garden' | 'village-market' | 'greenhouse' | 'water-conservation';

export interface World {
  id: WorldId;
  title: string;
  subtitle: string;
  iconName: string;
  themeColor: string;
  accentColor: string;
  tagline: string;
  description: string;
  localHighlight: string;
  problemCount: number;
}

export type SupportLevel = 'basic' | 'applied' | 'challenge';

export interface SubQuestion {
  id: string;
  title: string;
  questionText: string;
  type: 'numeric' | 'choice';
  options?: { id: string; text: string }[];
  correctAnswer: number | string;
  unit: string;
  tolerance?: number;
  hints: {
    basic: string;
    applied: string;
    challenge: string;
  };
  explanation: string;
  misconceptions?: { [key: string]: string };
}

export interface VariableParam {
  name: string;
  symbol: string;
  value: number;
  unit: string;
  description?: string;
}

export interface MathProblem {
  id: string;
  worldId: WorldId;
  title: string;
  grade: string;
  topic: string;
  difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  isSimulated: boolean; // true = "Mô phỏng", false = "Dữ liệu thực tế"
  dataSource: string;
  recordDate: string;
  story: string;
  variables: VariableParam[];
  subQuestions: SubQuestion[];
  realLifeTask: string;
  status: 'published' | 'pending_review';
  author: string;
}

export interface StudentRecord {
  id: string; // e.g. "HS01" -> "HS47" (Anonymized)
  group: 'Cần củng cố' | 'Vận dụng' | 'Phát triển năng khiếu';
  preTestScore: number; // 0 - 10
  postTestScore: number; // 0 - 10
  completedProblems: number;
  totalAttempts: number;
  commonErrors: string[];
  lastActive: string;
  assignedTasks: string[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  stepHintLevel?: SupportLevel;
}
