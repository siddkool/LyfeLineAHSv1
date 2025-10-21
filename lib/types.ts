export interface Lesson {
  id: string
  title: string
  category: "health" | "science" | "social" | "legal" | "myths"
  description: string
  content: string
  difficulty: "beginner" | "intermediate" | "advanced"
  pointsReward: number
  estimatedMinutes: number
}

export interface Quiz {
  lessonId: string
  questions: QuizQuestion[]
  passingScore: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export interface UserProgress {
  completedLessons: string[]
  quizScores: Record<string, { score: number; total: number; points: number; attempts: number }>
  totalPoints: number
  currentStreak: number
  lastActivityDate: string
}

export interface RaffleEntry {
  id: string
  name: string
  description: string
  pointsCost: number
  endDate: string
  image: string
}

export interface ShopItem {
  id: string
  name: string
  description: string
  pointsCost: number
  type: "raffle" | "minga"
  image: string
}

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
}

export type UserProfile = User
