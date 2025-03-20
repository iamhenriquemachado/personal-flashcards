import { FlashCard } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

/**
 * Fetch all flash cards for a specific category
 */
export async function fetchFlashCards(category: string): Promise<FlashCard[]> {
  try {
    const response = await fetch(`${API_URL}/flashcards?category=${category}`)
    
    if (!response.ok) {
      throw new Error(`Error fetching flash cards: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch flash cards:", error)
    return []
  }
}

/**
 * Create a new flash card
 */
export async function createFlashCard(flashCard: Omit<FlashCard, "id">): Promise<FlashCard | null> {
  try {
    const response = await fetch(`${API_URL}/flashcards`, {
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
