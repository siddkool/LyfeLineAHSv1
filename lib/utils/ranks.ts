export interface RankInfo {
  rank: string
  nextRank: string
  pointsToNext: number
  progress: number
  color: string
  icon: string
}

export function getRankInfo(totalPoints: number): RankInfo {
  // Rank thresholds
  const ranks = [
    { name: "Beginner", min: 0, max: 499, next: "Novice", color: "text-gray-600", icon: "🌱" },
    { name: "Novice", min: 500, max: 999, next: "Intermediate", color: "text-blue-600", icon: "⭐" },
    { name: "Intermediate", min: 1000, max: 1999, next: "Advanced", color: "text-purple-600", icon: "🔥" },
    { name: "Advanced", min: 2000, max: 4999, next: "Legend", color: "text-orange-600", icon: "💎" },
    { name: "Legend", min: 5000, max: Number.POSITIVE_INFINITY, next: "Legend", color: "text-yellow-600", icon: "👑" },
  ]

  // Find current rank
  const currentRank = ranks.find((r) => totalPoints >= r.min && totalPoints <= r.max) || ranks[0]

  // Calculate points to next rank
  const pointsToNext = currentRank.name === "Legend" ? 0 : currentRank.max + 1 - totalPoints

  // Calculate progress percentage within current rank
  const rangeSize = currentRank.max - currentRank.min + 1
  const pointsInRange = totalPoints - currentRank.min
  const progress = currentRank.name === "Legend" ? 100 : Math.min(100, (pointsInRange / rangeSize) * 100)

  return {
    rank: currentRank.name,
    nextRank: currentRank.next,
    pointsToNext,
    progress,
    color: currentRank.color,
    icon: currentRank.icon,
  }
}
