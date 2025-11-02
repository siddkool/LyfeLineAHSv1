"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LESSONS } from "@/lib/lessons-data"
import { useUserProgress } from "@/lib/hooks/use-user-progress"
import { completeLesson } from "@/lib/storage"
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizData {
  questions: QuizQuestion[]
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { progress, updateProgress, userId } = useUserProgress()

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const lesson = LESSONS.find((l) => l.id === id)

  useEffect(() => {
    if (!lesson || !userId) return

    const loadQuizData = async () => {
      try {
        const supabase = getSupabase()
        const { data: quizScores, error } = await supabase
          .from("quiz_scores")
          .select("id")
          .eq("user_id", userId)
          .eq("lesson_id", lesson.id)

        if (error) {
          console.error("[v0] Error fetching quiz attempts:", error)
        }

        const currentAttempts = quizScores?.length || 0
        setAttemptCount(currentAttempts)
        console.log("[v0] Current attempt count for lesson", lesson.id, ":", currentAttempts)

        // Generate quiz
        const response = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonTitle: lesson.title,
            lessonContent: lesson.content,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate quiz")

        const data = await response.json()
        setQuiz(data)
      } catch (error) {
        console.error("[v0] Error loading quiz:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizData()
  }, [lesson, userId])

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

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    setShowExplanation(true)
    setAnswers([...answers, selectedAnswer])
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz complete
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    if (!quiz || !progress || !userId) return

    const correctAnswers = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)

    const newAttemptCount = attemptCount + 1
    let maxAttempts = 5 // beginner
    if (lesson.difficulty === "intermediate") maxAttempts = 7
    if (lesson.difficulty === "advanced") maxAttempts = 10

    console.log("[v0] Finishing quiz - Attempt", newAttemptCount, "of", maxAttempts)

    // Award points based on score, but only if under attempt limit
    let pointsEarned = 0
    if (newAttemptCount <= maxAttempts) {
      if (score >= 80) {
        pointsEarned = lesson.pointsReward
      } else if (score >= 60) {
        pointsEarned = Math.round(lesson.pointsReward * 0.7)
      } else if (score >= 40) {
        pointsEarned = Math.round(lesson.pointsReward * 0.5)
      }
      console.log("[v0] Points earned:", pointsEarned)
    } else {
      console.log("[v0] Max attempts reached, no points awarded")
    }

    await completeLesson(lesson.id, correctAnswers, quiz.questions.length, pointsEarned, userId)

    // Update local state
    const newProgress = {
      ...progress,
      completedLessons: progress.completedLessons.includes(lesson.id)
        ? progress.completedLessons
        : [...progress.completedLessons, lesson.id],
      quizScores: {
        ...progress.quizScores,
        [lesson.id]: {
          score: correctAnswers,
          total: quiz.questions.length,
          points: pointsEarned,
        },
      },
      totalPoints: progress.totalPoints + pointsEarned,
    }
    updateProgress(newProgress)

    setAttemptCount(newAttemptCount)
    setIsComplete(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">Generating your personalized quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Failed to load quiz</h1>
          <Link href={`/lessons/${id}`}>
            <Button>Back to Lesson</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isComplete) {
    const correctAnswers = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= 60

    let maxAttempts = 5
    if (lesson.difficulty === "intermediate") maxAttempts = 7
    if (lesson.difficulty === "advanced") maxAttempts = 10
    const canEarnPoints = attemptCount <= maxAttempts

    let pointsEarned = 0
    if (canEarnPoints) {
      if (score >= 80) {
        pointsEarned = lesson.pointsReward
      } else if (score >= 60) {
        pointsEarned = Math.round(lesson.pointsReward * 0.7)
      } else if (score >= 40) {
        pointsEarned = Math.round(lesson.pointsReward * 0.5)
      }
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-6 md:p-8 text-center">
          <div
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center",
              passed ? "bg-secondary/10" : "bg-destructive/10",
            )}
          >
            {passed ? (
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
            ) : (
              <XCircle className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance">
            {passed ? "Great Job!" : "Keep Learning!"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed text-pretty">
            You scored {correctAnswers} out of {quiz.questions.length} questions correctly
          </p>

          <div className="bg-muted rounded-lg p-5 md:p-6 mb-6 md:mb-8">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{score}%</div>
            <div className="text-sm sm:text-base text-muted-foreground mb-3 md:mb-4">Your Score</div>

            <div className="text-sm sm:text-base text-muted-foreground mb-2">
              Attempt {attemptCount} of {maxAttempts}
            </div>

            {pointsEarned > 0 && (
              <div className="flex items-center justify-center gap-2 text-accent">
                <Trophy className="w-5 h-5" />
                <span className="text-sm sm:text-base font-semibold">+{pointsEarned} points earned!</span>
              </div>
            )}

            {!canEarnPoints && (
              <div className="text-sm sm:text-base text-muted-foreground mt-2 text-pretty">
                Maximum attempts reached - no points awarded
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center">
            <Link href="/lessons" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Lessons
              </Button>
            </Link>
            <Link href={`/lessons/${id}`} className="flex-1 sm:flex-initial">
              <Button className="w-full">Review Lesson</Button>
            </Link>
            {(!passed || !canEarnPoints) && (
              <Button onClick={() => window.location.reload()} variant="default" className="w-full sm:w-auto">
                Retake Quiz
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progressPercent = ((currentQuestion + 1) / quiz.questions.length) * 100
  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <Link href={`/lessons/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2 mb-3 md:mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Lesson
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-balance leading-tight">
                {lesson.title} - Quiz
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs sm:text-sm text-muted-foreground">Potential Reward</div>
              <div className="flex items-center gap-1 text-accent font-semibold">
                <Trophy className="w-4 h-4" />
                <span className="text-sm sm:text-base">{lesson.pointsReward} pts</span>
              </div>
            </div>
          </div>

          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-5 md:p-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-5 md:mb-6 text-balance leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const showCorrect = showExplanation && index === question.correctAnswer
                const showIncorrect = showExplanation && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full p-3 md:p-4 text-left rounded-lg border-2 transition-all text-sm sm:text-base",
                      "hover:border-primary disabled:cursor-not-allowed active:scale-[0.98]",
                      isSelected && !showExplanation && "border-primary bg-primary/5",
                      showCorrect && "border-secondary bg-secondary/10",
                      showIncorrect && "border-destructive bg-destructive/10",
                      !isSelected && !showCorrect && !showIncorrect && "border-border",
                    )}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          isSelected && !showExplanation && "border-primary bg-primary text-primary-foreground",
                          showCorrect && "border-secondary bg-secondary text-secondary-foreground",
                          showIncorrect && "border-destructive bg-destructive text-destructive-foreground",
                          !isSelected && !showCorrect && !showIncorrect && "border-muted-foreground",
                        )}
                      >
                        {showCorrect && <CheckCircle2 className="w-4 h-4" />}
                        {showIncorrect && <XCircle className="w-4 h-4" />}
                        {!showCorrect && !showIncorrect && (
                          <span className="text-xs font-semibold">{String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <span className="text-pretty leading-relaxed">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {showExplanation && (
              <Card className={cn("p-3 md:p-4 mb-5 md:mb-6", isCorrect ? "bg-secondary/10" : "bg-destructive/10")}>
                <div className="flex items-start gap-2 md:gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-base font-semibold mb-1">
                      {isCorrect ? "Correct!" : "Not quite right"}
                    </div>
                    <p className="text-xs sm:text-sm text-pretty leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-end">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} size="lg" className="w-full sm:w-auto">
                  {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
