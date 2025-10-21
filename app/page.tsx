"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 md:gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center">
            <Image
              src="/lyfeline-logo.png"
              alt="Lyfeline"
              width={300}
              height={100}
              className="w-64 md:w-80 h-auto"
              priority
            />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground text-balance px-4">
            Learn the truth about vaping through engaging lessons, earn points with quizzes, and redeem rewards
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-2 md:mt-4 w-full sm:w-auto px-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90">
                <BookOpen className="w-5 h-5" />
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 max-w-5xl mx-auto">
          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Comprehensive Lessons</h3>
            <p className="text-muted-foreground text-sm">
              Explore dozens of lessons covering health, science, social impacts, legal issues, and myth-busting
            </p>
          </Card>

          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Interactive Quizzes</h3>
            <p className="text-muted-foreground text-sm">
              Test your knowledge with engaging quizzes tailored to each lesson
            </p>
          </Card>

          <Card className="p-5 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Earn Rewards</h3>
            <p className="text-muted-foreground text-sm">
              Collect points and redeem them for raffle entries and MINGA points for school
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-card rounded-xl border shadow-sm max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Why Learn About Vaping?</h2>
          <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">20%</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">of high school students vape</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">25</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">age when brain fully develops</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-accent">$2,000+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">average yearly cost of vaping</div>
            </div>
          </div>
        </div>
      </div>

      <InstallPrompt />
    </div>
  )
}
