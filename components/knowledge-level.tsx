"use client"

import { Button } from "@/components/ui/button"

interface KnowledgeLevelProps {
  onSelect: (level: number) => void
}

export function KnowledgeLevel({ onSelect }: KnowledgeLevelProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-300"
        onClick={() => onSelect(1)}
      >
        1 - Not at all
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950 dark:hover:text-orange-300"
        onClick={() => onSelect(2)}
      >
        2 - Barely
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950 dark:hover:text-yellow-300"
        onClick={() => onSelect(3)}
      >
        3 - Somewhat
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-green-200 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-300"
        onClick={() => onSelect(4)}
      >
        4 - Well
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
        onClick={() => onSelect(5)}
      >
        5 - Perfectly
      </Button>
    </div>
  )
}

