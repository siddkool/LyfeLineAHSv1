import type { UserProgress, User } from "./types"
import { createBrowserClient } from "@supabase/ssr"

const STORAGE_KEYS = {
  USER_PROGRESS: "vape_edu_user_progress",
  COMPLETED_QUIZZES: "vape_edu_completed_quizzes",
  CURRENT_USER: "vape_edu_current_user",
  USERS_DB: "vape_edu_users_db",
}

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return {
      completedLessons: [],
      quizScores: {},
      totalPoints: 0,
      currentStreak: 0,
      lastActivityDate: new Date().toISOString(),
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
  if (!stored) {
    const defaultProgress: UserProgress = {
      completedLessons: [],
      quizScores: {},
      totalPoints: 0,
      currentStreak: 0,
      lastActivityDate: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(defaultProgress))
    return defaultProgress
  }

  return JSON.parse(stored)
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
}

export function addPoints(points: number): void {
  const progress = getUserProgress()
  progress.totalPoints += points
  progress.lastActivityDate = new Date().toISOString()
  saveUserProgress(progress)
}

export async function completeLesson(
  lessonId: string,
  quizScore: number,
  totalQuestions: number,
  pointsEarned: number,
  userId: string,
): Promise<void> {
  // Get current profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_points, current_streak, last_activity_date")
    .eq("id", userId)
    .single()

  if (!profile) return

  // Calculate new streak
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
  const lastActivity = profile.last_activity_date
  let newStreak = profile.current_streak || 0

  if (lastActivity) {
    const lastDate = new Date(lastActivity)
    const todayDate = new Date(today)
    const diffTime = todayDate.getTime() - lastDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Same day, keep streak
      newStreak = profile.current_streak || 1
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      newStreak = (profile.current_streak || 0) + 1
    } else {
      // Streak broken, reset to 1
      newStreak = 1
    }
  } else {
    // First activity ever
    newStreak = 1
  }

  // Insert completed lesson
  await supabase.from("completed_lessons").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
    },
    { onConflict: "user_id,lesson_id" },
  )

  // Insert quiz score
  await supabase.from("quiz_scores").insert({
    user_id: userId,
    lesson_id: lessonId,
    score: quizScore,
    total_questions: totalQuestions,
    points_earned: pointsEarned,
  })

  // Update profile with points, streak, and last activity date
  await supabase
    .from("profiles")
    .update({
      total_points: profile.total_points + pointsEarned,
      current_streak: newStreak,
      last_activity_date: today,
    })
    .eq("id", userId)
}

export function spendPoints(amount: number): boolean {
  const progress = getUserProgress()

  if (progress.totalPoints < amount) {
    return false
  }

  progress.totalPoints -= amount
  saveUserProgress(progress)
  return true
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return stored ? JSON.parse(stored) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB)
  return stored ? JSON.parse(stored) : []
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return
  const users = getAllUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | undefined {
  return getAllUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function logout(): void {
  setCurrentUser(null)
}
