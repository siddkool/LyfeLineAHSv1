"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/lessons", label: "Lessons", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm z-50 md:hidden shadow-lg">
      <div className="flex items-center justify-around p-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

          return (
            <Link key={link.href} href={link.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col gap-1 h-auto py-2 w-full rounded-lg transition-colors",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
