"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LESSONS } from "@/lib/lessons-data"
import { useUserProgress } from "@/lib/hooks/use-user-progress"
import { ArrowLeft, Clock, Trophy, BookOpen, CheckCircle2 } from "lucide-react"

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { progress } = useUserProgress()
  const [hasRead, setHasRead] = useState(false)

  const lesson = LESSONS.find((l) => l.id === id)

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link href="/lessons">
            <Button>Back to Lessons</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isCompleted = progress?.completedLessons.includes(lesson.id)
  const score = progress?.quizScores[lesson.id]

  const handleStartQuiz = () => {
    setHasRead(true)
    router.push(`/lessons/${lesson.id}/quiz`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/lessons">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Lessons
            </Button>
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge className={DIFFICULTY_COLORS[lesson.difficulty]}>{lesson.difficulty}</Badge>
                <Badge variant="outline" className="capitalize">
                  {lesson.category}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-secondary text-secondary-foreground gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance leading-tight">{lesson.title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed text-pretty">
                {lesson.description}
              </p>
            </div>

            <Card className="px-4 py-3 shrink-0">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{lesson.estimatedMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span>{lesson.pointsReward} pts</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 sm:p-8 lg:p-10">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-balance prose-p:text-pretty">
              {lesson.content.split("\n\n").map((paragraph, index) => {
                // Handle bold headers
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  const text = paragraph.slice(2, -2)
                  return (
                    <h2
                      key={index}
                      className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 mb-4 first:mt-0 leading-tight"
                    >
                      {text}
                    </h2>
                  )
                }

                // Handle bullet points
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").filter((line) => line.startsWith("- "))
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-3 my-6">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed text-pretty">
                          {item.slice(2)}
                        </li>
                      ))}
                    </ul>
                  )
                }

                // Regular paragraphs
                return (
                  <p key={index} className="mb-6 text-base sm:text-lg leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </Card>

          {/* Quiz CTA */}
          <div className="mt-8">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-balance">Ready to test your knowledge?</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed text-pretty">
                    Take the AI-generated quiz to earn {lesson.pointsReward} points and complete this lesson.
                  </p>
                  {isCompleted && score !== undefined ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">Previous Score: </span>
                        <span className="text-secondary font-bold">
                          {Math.round((score.score / score.total) * 100)}%
                        </span>
                      </div>
                      <Button onClick={handleStartQuiz}>Retake Quiz</Button>
                    </div>
                  ) : (
                    <Button onClick={handleStartQuiz} size="lg">
                      Start Quiz
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
