export interface FlashCard {
  id: string
  question: string
  answer: string
  category: "general" | "coding"
  explanation?: string
  code?: string 
  difficulty?: "easy" | "medium" | "hard"
  tags?: string[]
}

