"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, LogOut } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { UserProfile } from "@/lib/types"
import { useAuth } from "@/lib/hooks/use-auth"

const AVATAR_OPTIONS = [
  "😊",
  "😎",
  "🤓",
  "🥳",
  "🤩",
  "😇",
  "🦸",
  "🧑‍🎓",
  "🧑‍🔬",
  "🧑‍💻",
  "🦊",
  "🐼",
  "🐨",
  "🦁",
  "🐯",
  "🐸",
  "🦄",
  "🐙",
  "🦋",
  "🌟",
]

export default function SettingsPage() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createBrowserClient()

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push("/login")
        return
      }

      // Fetch profile data from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()

      if (profileError || !profile) {
        console.error("[v0] Error loading profile:", profileError)
        router.push("/login")
        return
      }

      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.display_name || profile.username,
        avatar: profile.avatar || "😊",
        bio: profile.bio || "",
        createdAt: profile.created_at,
      }

      setUser(userProfile)
      setDisplayName(userProfile.displayName)
      setBio(userProfile.bio || "")
      setSelectedAvatar(userProfile.avatar || "😊")
      setLoading(false)
    }

    loadUser()
  }, [router])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    setMessage("")

    if (!displayName.trim()) {
      setMessage("Display name cannot be empty")
      setIsSaving(false)
      return
    }

    try {
      const supabase = createBrowserClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim(),
          avatar: selectedAvatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("[v0] Error updating profile:", error)
        setMessage("Failed to update profile. Please try again.")
        setIsSaving(false)
        return
      }

      const updatedUser: UserProfile = {
        ...user,
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: selectedAvatar,
      }

      setUser(updatedUser)
      setMessage("Profile updated successfully!")
      setIsSaving(false)
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      setMessage("Failed to update profile. Please try again.")
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="gap-2 mb-3 md:mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Customize your profile and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* Avatar Selection */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Choose Your Avatar</h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl md:text-4xl p-2 md:p-3 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                    selectedAvatar === avatar ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 md:p-4 bg-muted rounded-lg flex items-center gap-3">
              <div className="text-4xl md:text-5xl">{selectedAvatar}</div>
              <div>
                <div className="text-sm md:text-base font-medium">Preview</div>
                <div className="text-xs md:text-sm text-muted-foreground">This is how others will see you</div>
              </div>
            </div>
          </Card>

          {/* Profile Information */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Profile Information</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs md:text-sm text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" value={user.username} disabled className="bg-muted" />
                <p className="text-xs md:text-sm text-muted-foreground">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  maxLength={50}
                />
                <p className="text-xs md:text-sm text-muted-foreground">
                  This is how your name appears on the leaderboard
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  maxLength={200}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <p className="text-xs md:text-sm text-muted-foreground text-right">{bio.length}/200 characters</p>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex flex-col gap-3">
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("success")
                    ? "bg-green-500/10 text-green-600 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message}
              </div>
            )}

            <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2 h-11 md:h-12 text-base">
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 h-11 md:h-12 text-base text-destructive hover:text-destructive bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
