export interface FlashCard {
  id: string
  question: string
  answer: string
  explanation?: string
  code?: string
  category: "general" | "coding"
}

