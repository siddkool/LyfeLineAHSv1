"use client"

import { useState, useEffect, useCallback } from "react"
import { getSupabase } from "@/lib/supabase/client"

export interface UserProgress {
  totalPoints: number
  completedLessons: string[]
  quizScores: Record<string, { score: number; total: number; points: number }>
  currentStreak: number
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const loadProgress = useCallback(async () => {
    try {
      const supabase = getSupabase()
      console.log("[v0] Loading user progress...")

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("[v0] User data:", user?.email, "Error:", userError)

      if (!user) {
        console.log("[v0] No user found, stopping progress load")
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      const [profileData, lessonsData, quizzesData] = await Promise.all([
        supabase.from("profiles").select("total_points, current_streak").eq("id", user.id).single(),
        supabase.from("completed_lessons").select("lesson_id").eq("user_id", user.id),
        supabase.from("quiz_scores").select("lesson_id, score, total_questions, points_earned").eq("user_id", user.id),
      ])

      console.log("[v0] Profile data:", profileData)
      console.log("[v0] Lessons data:", lessonsData)
      console.log("[v0] Quizzes data:", quizzesData)

      if (profileData.error) {
        console.error("[v0] Profile fetch error:", profileData.error)
      }

      const completedLessons = lessonsData.data?.map((l) => l.lesson_id) || []
      const quizScores: Record<string, { score: number; total: number; points: number }> = {}

      quizzesData.data?.forEach((quiz) => {
        quizScores[quiz.lesson_id] = {
          score: quiz.score,
          total: quiz.total_questions,
          points: quiz.points_earned,
        }
      })

      const totalPoints = profileData.data?.total_points || 0
      console.log("[v0] Setting total points to:", totalPoints)

      setProgress({
        totalPoints,
        completedLessons,
        quizScores,
        currentStreak: profileData.data?.current_streak || 0,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading progress:", error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const updateProgress = async (newProgress: UserProgress) => {
    if (!userId) return

    setProgress(newProgress)

    const supabase = getSupabase()
    await supabase.from("profiles").update({ total_points: newProgress.totalPoints }).eq("id", userId)
  }

  return { progress, updateProgress, isLoading, userId, refetch: loadProgress }
}
