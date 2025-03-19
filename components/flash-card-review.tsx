"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { KnowledgeLevel } from "@/components/knowledge-level"
import type { FlashCard } from "@/lib/types"

interface FlashCardReviewProps {
  flashCards: FlashCard[]
  category: string
}

export function FlashCardReview({ flashCards, category }: FlashCardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCards, setCompletedCards] = useState<Record<string, number>>({})

  const currentCard = flashCards[currentIndex]
  const progress = (Object.keys(completedCards).length / flashCards.length) * 100

  const handleNext = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKnowledgeLevel = (level: number) => {
    setCompletedCards({
      ...completedCards,
      [currentCard.id]: level,
    })

    // Move to next card if available
    if (currentIndex < flashCards.length - 1) {
      handleNext()
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setCompletedCards({})
  }

  if (flashCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flash cards available for this category.</p>
      </div>
    )
  }

  const cardClass = category === "general" ? "card-gradient-general" : "card-gradient-coding"
  const badgeClass = category === "general" ? "badge-general" : "badge-coding"
  const progressColor = category === "general" ? "bg-[hsl(var(--info))]" : "bg-[hsl(var(--accent))]"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashCards.length}
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="relative perspective-1000">
        <div
          className={`relative transition-all duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Card className={`min-h-[300px] flex items-center justify-center backface-hidden ${cardClass}`}>
            <CardContent className="p-6 text-center">
              <div className={`inline-block mb-4 ${badgeClass}`}>{category}</div>
              <div className="text-xl font-medium">{currentCard.question}</div>
              {currentCard.code && (
                <pre className="mt-4 p-4 bg-muted rounded-md text-left overflow-x-auto">
                  <code>{currentCard.code}</code>
                </pre>
              )}
              <div className="mt-6 text-sm text-muted-foreground">Click to reveal answer</div>
            </CardContent>
          </Card>

          <Card
            className={`min-h-[300px] flex items-center justify-center absolute inset-0 backface-hidden rotate-y-180 ${cardClass}`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-xl font-medium mb-6">{currentCard.answer}</div>
              {currentCard.explanation && <p className="text-muted-foreground mb-6">{currentCard.explanation}</p>}

              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-2">How well did you know this?</p>
                <KnowledgeLevel onSelect={handleKnowledgeLevel} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="border-[hsl(var(--primary)/0.2)] hover:bg-[hsl(var(--primary)/0.1)]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === flashCards.length - 1}
          className="border-[hsl(var(--primary)/0.2)] hover:bg-[hsl(var(--primary)/0.1)]"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

