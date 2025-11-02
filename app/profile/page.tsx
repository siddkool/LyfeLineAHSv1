"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useUserProgress } from "@/lib/hooks/use-user-progress"
import { LESSONS } from "@/lib/lessons-data"
import { Navigation } from "@/components/navigation"
import { Trophy, BookOpen, Target, TrendingUp, Award, ShoppingBag, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { getRankInfo } from "@/lib/utils/ranks"

export default function ProfilePage() {
  const router = useRouter()
  const { progress, isLoading } = useUserProgress()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = getSupabase()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/login")
        return
      }

      // Fetch profile data to get username, display name, etc.
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          username: profile.username || authUser.email!.split("@")[0],
          displayName: profile.display_name || profile.username || authUser.email!.split("@")[0],
          avatar: profile.avatar || "😊",
          bio: profile.bio || "",
        })
      }
      setAuthLoading(false)
    }

    loadUser()
  }, [router])

  if (isLoading || authLoading || !progress || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading your progress...</div>
        </div>
      </div>
    )
  }

  const completedCount = progress.completedLessons.length
  const totalLessons = LESSONS.length
  const completionPercent = Math.round((completedCount / totalLessons) * 100)

  // Calculate category progress
  const categoryStats = LESSONS.reduce(
    (acc, lesson) => {
      if (!acc[lesson.category]) {
        acc[lesson.category] = { total: 0, completed: 0 }
      }
      acc[lesson.category].total++
      if (progress.completedLessons.includes(lesson.id)) {
        acc[lesson.category].completed++
      }
      return acc
    },
    {} as Record<string, { total: number; completed: number }>,
  )

  const scores = Object.values(progress.quizScores)
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, scoreObj) => sum + (scoreObj.score / scoreObj.total) * 100, 0) / scores.length)
      : 0

  const rankInfo = getRankInfo(progress.totalPoints)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{user.avatar || "😊"}</div>
              <div>
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground mt-1">@{user.username}</p>
                {user.bio && <p className="text-sm text-muted-foreground mt-2 max-w-md">{user.bio}</p>}
              </div>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Points & Rank */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Points</div>
                  <div className="text-4xl font-bold text-accent">{progress.totalPoints}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
              </div>
              <Link href="/shop">
                <Button className="w-full gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Visit Shop
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Rank</div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{rankInfo.icon}</span>
                    <span className={`text-4xl font-bold ${rankInfo.color}`}>{rankInfo.rank}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              {rankInfo.rank !== "Legend" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next: {rankInfo.nextRank}</span>
                    <span className="font-medium">{rankInfo.pointsToNext} pts to go</span>
                  </div>
                  <Progress value={rankInfo.progress} />
                </div>
              )}
              {rankInfo.rank === "Legend" && (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">🎉 You've reached the highest rank!</p>
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2">
            <h2 className="text-lg font-semibold mb-6">Your Statistics</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Lessons Completed */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Lessons Completed</div>
                </div>
                <div className="text-3xl font-bold">
                  {completedCount}
                  <span className="text-xl text-muted-foreground font-normal">/{totalLessons}</span>
                </div>
                <div className="space-y-1.5">
                  <Progress value={completionPercent} className="h-2 bg-secondary/20" />
                  <div className="text-xs text-muted-foreground">{completionPercent}% complete</div>
                </div>
              </div>

              {/* Average Score */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Average Score</div>
                </div>
                <div className="text-3xl font-bold">
                  {averageScore}
                  <span className="text-xl text-muted-foreground font-normal">%</span>
                </div>
                <div className="space-y-1.5">
                  <Progress value={averageScore} className="h-2 bg-primary/20" />
                  <div className="text-xs text-muted-foreground">
                    {scores.length} {scores.length === 1 ? "quiz" : "quizzes"} taken
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Current Streak</div>
                </div>
                <div className="text-3xl font-bold">{progress.currentStreak}</div>
                <div className="space-y-1.5">
                  <div className="h-2 rounded-full bg-accent/20">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${Math.min(progress.currentStreak * 10, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">days in a row</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Category Progress */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Progress by Category</h2>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const percent = Math.round((stats.completed / stats.total) * 100)
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {stats.completed}/{stats.total} lessons
                        </span>
                      </div>
                      <span className="text-sm font-medium">{percent}%</span>
                    </div>
                    <Progress value={percent} />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Recent Achievements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Completions</h2>
            {completedCount === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No lessons completed yet</p>
                <Link href="/lessons">
                  <Button className="mt-4">Start Learning</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.completedLessons
                  .slice(-5)
                  .reverse()
                  .map((lessonId) => {
                    const lesson = LESSONS.find((l) => l.id === lessonId)
                    if (!lesson) return null
                    const score = progress.quizScores[lessonId]

                    return (
                      <Link key={lessonId} href={`/lessons/${lessonId}`}>
                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-medium text-balance">{lesson.title}</div>
                              <div className="text-sm text-muted-foreground capitalize">{lesson.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                Score: {score ? Math.round((score.score / score.total) * 100) : 0}%
                              </div>
                              <div className="text-xs text-muted-foreground">+{lesson.pointsReward} pts</div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
