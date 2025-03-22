import type { FlashCard } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Fetch all flash cards for a specific category
 */
export async function fetchFlashCards(category: string): Promise<FlashCard[]> {
  try {
    // Normalize category for consistency
    const normalizedCategory = category.toLowerCase()

    // Log category and URL for debugging
    const url = `${API_URL}/api/flashcards/category/${normalizedCategory}`
    console.log(`Fetching flash cards for category: ${normalizedCategory}`)
    console.log(`Request URL: ${url}`)

    // Make the request with cache control
    const response = await fetch(url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching flash cards: ${response.statusText}`)
    }

    const data = await response.json()

    // Log the response data for debugging
    console.log(`Received data:`, data)

    // Handle both potential response formats (array or {response: array})
    const cards = Array.isArray(data) ? data : data.response || []

    if (!Array.isArray(cards)) {
      console.error(`Unexpected response format:`, data)
      return []
    }

    // Return the cards without additional filtering
    // The API should already be filtering by category
    return cards
  } catch (error) {
    console.error("Error fetching flashcards:", error)
    return []
  }
}

/**
 * Fetch all flashcards (without category filtering)
 */
export async function fetchAllFlashCards() {
  try {
    const response = await fetch('http://localhost:8000/api/flashcards');
    if (!response.ok) {
      throw new Error(`Error fetching all flash cards: ${response.statusText}`);
    }

    const data = await response.json();
    // Return the raw response to handle both possible formats
    // (either { response: [...] } or direct array)
    return data;
  } catch (error) {
    console.error("Failed to fetch all flash cards:", error);
    return { response: [] }; // Return in a consistent format for error handling
  }
}

/**
 * Create a new flash card
 */
export async function createFlashCard(flashCard: Omit<FlashCard, "id">): Promise<FlashCard | null> {
  try {
    const response = await fetch(`${API_URL}/api/flashcards/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flashCard),
    })
    
    if (!response.ok) {
      throw new Error(`Error creating flash card: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to create flash card:", error)
    return null
  }
}

/**
 * Update a flash card
 */
export async function updateFlashCard(id: string, flashCard: Partial<FlashCard>): Promise<FlashCard | null> {
  try {
    const response = await fetch(`${API_URL}/flashcards/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flashCard),
    })
    
    if (!response.ok) {
      throw new Error(`Error updating flash card: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to update flash card:", error)
    return null
  }
}

/**
 * Delete a flash card
 */
export async function deleteFlashCard(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/flashcards/${id}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error(`Error deleting flash card: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error("Failed to delete flash card:", error)
    return false
  }
}

/**
 * Save user progress for a flash card
 */
export async function saveProgress(flashCardId: string, knowledgeLevel: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flashCardId,
        knowledgeLevel,
        timestamp: new Date().toISOString(),
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Error saving progress: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error("Failed to save progress:", error)
    return false
  }
}

/**
 * Get user progress for all flash cards
 */
export async function getUserProgress(): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${API_URL}/progress`)
    
    if (!response.ok) {
      throw new Error(`Error fetching progress: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Convert array of progress items to a record of flashCardId -> knowledgeLevel
    return data.reduce((acc: Record<string, number>, item: any) => {
      acc[item.flashCardId] = item.knowledgeLevel
      return acc
    }, {})
  } catch (error) {
    console.error("Failed to fetch progress:", error)
    return {}
  }
}

// Add a new function to directly fetch by category with a different approach
export async function fetchFlashCardsByCategory(category: "general" | "coding"): Promise<FlashCard[]> {
  try {
    // Log the exact category being requested
    console.log(`🔍 fetchFlashCardsByCategory called with category: "${category}"`)

    // Fetch all cards first
    const response = await fetch(`${API_URL}/api/flashcards`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching all flash cards: ${response.statusText}`)
    }

    const data = await response.json()
    const allCards = Array.isArray(data) ? data : data.response || []

    console.log(`📊 Total cards fetched: ${allCards.length}`)

    // Filter by category with explicit type annotation
    const filteredCards = allCards.filter((card: any) => {
      // Add extra logging to debug category issues
      if (typeof card.category !== "string") {
        console.warn("⚠️ Card with invalid category:", card)
        return false
      }

      const cardCategory = card.category.toLowerCase()
      const targetCategory = category.toLowerCase()

      // Check for exact match with the requested category
      const isMatch = cardCategory === targetCategory

      // For coding cards, also include subcategories like "algorithms" or "data structures"
      const isCodingSubcategory =
        targetCategory === "coding" && ["algorithms", "data structures", "programming", "coding"].includes(cardCategory)

      console.log(
        `🔍 Card: "${cardCategory}" vs Target: "${targetCategory}" => Match: ${isMatch || isCodingSubcategory}`,
      )

      return isMatch || isCodingSubcategory
    })

    console.log(`✅ Filtered ${filteredCards.length} "${category}" cards from ${allCards.length} total cards`)

    return filteredCards as FlashCard[]
  } catch (error) {
    console.error("❌ Error in fetchFlashCardsByCategory:", error)
    return []
  }
}

