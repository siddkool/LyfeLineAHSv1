"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LESSONS } from "@/lib/lessons-data"
import { useUserProgress } from "@/lib/hooks/use-user-progress"
import { Navigation } from "@/components/navigation"
import { BookOpen, Clock, Trophy, Search, CheckCircle2, Sparkles } from "lucide-react"
import { getRankInfo } from "@/lib/utils/ranks"

const CATEGORIES = [
  { id: "all", label: "All Lessons", color: "bg-primary" },
  { id: "health", label: "Health", color: "bg-red-500" },
  { id: "science", label: "Science", color: "bg-blue-500" },
  { id: "social", label: "Social", color: "bg-purple-500" },
  { id: "legal", label: "Legal", color: "bg-amber-500" },
  { id: "myths", label: "Myths", color: "bg-emerald-500" },
]

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export default function LessonsPage() {
  const { progress, isLoading } = useUserProgress()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const completedCount = progress?.completedLessons.length || 0
  const totalPoints = progress?.totalPoints || 0
  const rankInfo = getRankInfo(totalPoints)

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b bg-lifeline-soft shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-lifeline">Lessons</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">Learn about vaping and earn points</p>
            </div>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Card className="p-4 md:p-5 flex flex-col items-center justify-center text-center hover-lift border-2 border-border hover:border-lifeline transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-lifeline flex items-center justify-center mb-2 shadow-lifeline">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Completed</div>
                <div className="text-xl md:text-2xl font-bold text-lifeline">
                  {completedCount}/{LESSONS.length}
                </div>
              </Card>

              <Card className="p-4 md:p-5 flex flex-col items-center justify-center text-center hover-lift border-2 border-border hover:border-lifeline transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary flex items-center justify-center mb-2 shadow-lg">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Total Points</div>
                <div className="text-xl md:text-2xl font-bold text-secondary">{totalPoints}</div>
              </Card>

              <Card className="p-4 md:p-5 flex flex-col items-center justify-center text-center hover-lift border-2 border-border hover:border-lifeline transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-lifeline flex items-center justify-center mb-2 shadow-lifeline">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Rank</div>
                <div className={`text-lg md:text-xl font-bold ${rankInfo.color}`}>{rankInfo.rank}</div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Search */}
        <div className="mb-4 md:mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-lifeline/20 focus:border-lifeline"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 ${
                selectedCategory === category.id
                  ? "bg-lifeline hover:bg-lifeline/90"
                  : "hover:border-lifeline hover:bg-lifeline-soft"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = progress?.completedLessons.includes(lesson.id)
            const score = progress?.quizScores[lesson.id]

            return (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <Card
                  className={`p-5 md:p-6 h-full flex flex-col gap-3 md:gap-4 hover-lift cursor-pointer border-2 transition-colors ${
                    isCompleted ? "border-lifeline bg-lifeline-soft" : "border-border hover:border-lifeline"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={DIFFICULTY_COLORS[lesson.difficulty]}>{lesson.difficulty}</Badge>
                    {isCompleted && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold mb-2 text-balance">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{lesson.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-amber-600">{lesson.pointsReward} pts</span>
                    </div>
                  </div>

                  {isCompleted && score && (
                    <div className="pt-3 border-t border-lifeline/20">
                      <div className="text-sm font-medium text-lifeline">
                        Quiz Score: {Math.round((score.score / score.total) * 100)}%
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lessons found matching your criteria</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
