"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUserProgress } from "@/lib/hooks/use-user-progress"
import { SHOP_ITEMS } from "@/lib/shop-data"
import { Navigation } from "@/components/navigation"
import { Trophy, GraduationCap, CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ShopPage() {
  const { progress, refetch } = useUserProgress()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const filteredItems = SHOP_ITEMS.filter((item) => item.type === "minga")

  const handlePurchase = async (itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId)
    if (!item || !progress) return

    if (progress.totalPoints < item.pointsCost) {
      alert("Not enough points!")
      return
    }

    setIsPurchasing(true)

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          itemName: item.name,
          itemType: item.type,
          pointsCost: item.pointsCost,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Purchase failed")
        return
      }

      await refetch()

      setSelectedItem(null)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error("[v0] Purchase error:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setIsPurchasing(false)
    }
  }

  const selectedShopItem = SHOP_ITEMS.find((i) => i.id === selectedItem)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Rewards Shop</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Redeem your points for MINGA rewards</p>
          </div>

          {/* Points Balance */}
          <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Your Balance</div>
                  <div className="text-xl md:text-2xl font-bold text-accent">{progress?.totalPoints || 0} points</div>
                </div>
              </div>
              <Link href="/lessons">
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  Earn More
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Shop Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => {
            const canAfford = (progress?.totalPoints || 0) >= item.pointsCost

            return (
              <Card key={item.id} className="overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 right-3 capitalize flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    MINGA
                  </Badge>
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="text-base md:text-lg font-semibold mb-2 text-balance">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 text-pretty">{item.description}</p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <Trophy className="w-4 h-4" />
                      <span>{item.pointsCost} pts</span>
                    </div>
                    <Button
                      onClick={() => setSelectedItem(item.id)}
                      disabled={!canAfford}
                      size="sm"
                      className="flex-1 max-w-[120px]"
                    >
                      {canAfford ? "Redeem" : "Not Enough"}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items available</p>
          </div>
        )}
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>Are you sure you want to redeem your points for this reward?</DialogDescription>
          </DialogHeader>

          {selectedShopItem && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedShopItem.image || "/placeholder.svg"}
                  alt={selectedShopItem.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold">{selectedShopItem.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedShopItem.description}</div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Cost:</span>
                  <span className="font-semibold">{selectedShopItem.pointsCost} points</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your Balance:</span>
                  <span className="font-semibold">{progress?.totalPoints || 0} points</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">After Purchase:</span>
                    <span className="font-bold text-accent">
                      {(progress?.totalPoints || 0) - selectedShopItem.pointsCost} points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)} disabled={isPurchasing}>
              Cancel
            </Button>
            <Button onClick={() => selectedItem && handlePurchase(selectedItem)} disabled={isPurchasing}>
              {isPurchasing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom">
          <Card className="p-4 bg-secondary text-secondary-foreground shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <div className="font-semibold">Purchase Successful!</div>
                <div className="text-sm opacity-90">Check your email for the receipt</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Navigation />
    </div>
  )
}
