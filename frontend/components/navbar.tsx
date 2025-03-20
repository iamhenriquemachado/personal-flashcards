"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />
          <span className="font-semibold">FlashCards</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                Home
              </Button>
            </Link>
            <Link href="/flashcards/general">
              <Button
                variant={pathname === "/flashcards/general" ? "default" : "ghost"}
                size="sm"
                className={
                  pathname === "/flashcards/general" ? "bg-[hsl(var(--info))] hover:bg-[hsl(var(--info)/0.9)]" : ""
                }
              >
                General
              </Button>
            </Link>
            <Link href="/flashcards/coding">
              <Button
                variant={pathname === "/flashcards/coding" ? "default" : "ghost"}
                size="sm"
                className={
                  pathname === "/flashcards/coding" ? "bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)]" : ""
                }
              >
                Coding
              </Button>
            </Link>
            <Link href="/create">
              <Button
                variant={pathname === "/create" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/create" ? "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)]" : ""}
              >
                Create
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}

