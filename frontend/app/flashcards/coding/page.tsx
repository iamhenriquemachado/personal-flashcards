"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import FlashCardReview from "@/components/flash-card-review"
import type { FlashCard } from "@/lib/types"
import { fetchFlashCardsByCategory } from "@/lib/api"
import CategorySelector from "@/components/category-selector"

export default function FlashCardsPage() {
  // Get the current pathname directly
  const pathname = usePathname()
  
  // Extract category directly from the pathname
  const categoryFromPath = pathname.includes("/coding") ? "coding" : "general"
  
  console.log(`🔍 Direct path check: "${pathname}" => category: "${categoryFromPath}"`)
  
  const [flashCards, setFlashCards] = useState<FlashCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadFlashCards = async () => {
      setLoading(true)
      try {
        console.log(`🔍 Fetching flashcards for category: "${categoryFromPath}"`)
        // Use the new direct category fetch function
        const cards = await fetchFlashCardsByCategory(categoryFromPath as "coding" | "general")
        console.log(`✅ Received ${cards.length} cards for "${categoryFromPath}"`)
        setFlashCards(cards)
        setError(null)
      } catch (err) {
        setError("Failed to load flashcards. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadFlashCards()
  }, [categoryFromPath])
  
  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-pulse">
          Loading {categoryFromPath === "general" ? "General Knowledge" : "Coding"} flashcards...
        </div>
      </div>
    )
  
  if (error)
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  
  return (
    <div className="container mx-auto py-8">
      <CategorySelector currentCategory={categoryFromPath} />
      {flashCards.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mt-4">
          No flashcards found for {categoryFromPath} category.
        </div>
      ) : (
        <FlashCardReview flashCards={flashCards} category={categoryFromPath} />
      )}
    </div>
  )
}