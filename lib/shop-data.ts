import type { ShopItem } from "./types"

export const SHOP_ITEMS: ShopItem[] = [
  // MINGA Points
  {
    id: "minga-5",
    name: "5 MINGA Points",
    description: "Redeem for school rewards and privileges",
    pointsCost: 5000,
    type: "minga",
    image: "/minga-logo.png",
  },
  {
    id: "minga-10",
    name: "10 MINGA Points (10% Off!)",
    description: "Best value - save 10% on bulk purchase",
    pointsCost: 9000,
    type: "minga",
    image: "/minga-logo.png",
  },
]
