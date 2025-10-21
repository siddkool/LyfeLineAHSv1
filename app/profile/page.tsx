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

  // Determine rank based on points
  let rank = "Beginner"
  let nextRank = "Explorer"
  let pointsToNext = 500
  if (progress.totalPoints >= 2000) {
    rank = "Master"
    nextRank = "Legend"
    pointsToNext = 5000 - progress.totalPoints
  } else if (progress.totalPoints >= 1000) {
    rank = "Expert"
    nextRank = "Master"
    pointsToNext = 2000 - progress.totalPoints
  } else if (progress.totalPoints >= 500) {
    rank = "Explorer"
    nextRank = "Expert"
    pointsToNext = 1000 - progress.totalPoints
  } else {
    pointsToNext = 500 - progress.totalPoints
  }

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
                  <div className="text-4xl font-bold text-primary">{rank}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next: {nextRank}</span>
                  <span className="font-medium">{pointsToNext} pts to go</span>
                </div>
                <Progress value={Math.min(100, ((progress.totalPoints % 1000) / 1000) * 100)} />
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                <div className="text-sm text-muted-foreground">Lessons Completed</div>
              </div>
              <div className="text-3xl font-bold">
                {completedCount}/{totalLessons}
              </div>
              <Progress value={completionPercent} className="mt-3" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-3xl font-bold">{averageScore}%</div>
              <Progress value={averageScore} className="mt-3" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-3xl font-bold">{progress.currentStreak}</div>
              <div className="text-sm text-muted-foreground mt-2">days in a row</div>
            </Card>
          </div>

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
