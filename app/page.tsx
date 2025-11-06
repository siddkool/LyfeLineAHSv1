"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Sparkles, Target, Award } from "lucide-react"
import { InstallPrompt } from "./install-prompt"
import Image from "next/image"
import { useAuth } from "@/lib/hooks/use-auth"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/lessons")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 md:gap-6 max-w-3xl mx-auto">
          <div className="relative flex items-center justify-center">
            <Image
              src="/lifeline-logo-new.png"
              alt="Lifeline"
              width={500}
              height={150}
              className="relative w-80 md:w-[450px] h-auto"
              priority
            />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground text-balance px-4 leading-relaxed">
            Learn the truth about vaping through engaging lessons, earn points with quizzes, and redeem rewards
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-2 md:mt-4 w-full sm:w-auto px-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-2 w-full sm:w-auto bg-lifeline hover:bg-lifeline/90 transition-colors shadow-lifeline"
              >
                <Sparkles className="w-5 h-5" />
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto border-2 border-border hover:border-lifeline hover:bg-lifeline-soft bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 max-w-5xl mx-auto">
          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 hover-lift border-2 border-border hover:border-lifeline transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-lifeline flex items-center justify-center shadow-lifeline">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold">Comprehensive Lessons</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Explore dozens of lessons covering health, science, social impacts, legal issues, and myth-busting
            </p>
          </Card>

          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 hover-lift border-2 border-border hover:border-lifeline transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold">Interactive Quizzes</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Test your knowledge with AI-generated quizzes tailored to each lesson
            </p>
          </Card>

          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 hover-lift border-2 border-border hover:border-lifeline transition-colors sm:col-span-2 md:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-lifeline flex items-center justify-center shadow-lifeline">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold">Earn Rewards</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Collect points and redeem them for raffle entries and MINGA points for school
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-card rounded-2xl border-2 border-lifeline shadow-lifeline max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-lifeline"></div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Why Learn About Vaping?</h2>
          <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
            <div className="p-4 rounded-xl bg-lifeline-soft border border-lifeline/20">
              <div className="text-2xl md:text-3xl font-bold text-lifeline">20%</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">of high school students vape</div>
            </div>
            <div className="p-4 rounded-xl bg-lifeline-soft border border-lifeline/20">
              <div className="text-2xl md:text-3xl font-bold text-lifeline">25</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">age when brain fully develops</div>
            </div>
            <div className="p-4 rounded-xl bg-lifeline-soft border border-lifeline/20">
              <div className="text-2xl md:text-3xl font-bold text-lifeline">$2,000+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">average yearly cost of vaping</div>
            </div>
          </div>
        </div>
      </div>

      <InstallPrompt />
    </div>
  )
}
