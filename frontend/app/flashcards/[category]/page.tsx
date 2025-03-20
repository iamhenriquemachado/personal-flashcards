import { notFound } from "next/navigation"
import FlashCardReview from "@/components/flash-card-review"
import { getFlashCards } from "@/lib/data"
import { FlashCard } from "@/lib/types" // Make sure to import the FlashCard type if needed

export default async function CategoryPage({ params }: { params?: { category?: string } }) {
  if (!params?.category) {
    notFound()
  }

  const category = params.category
  if (category !== "general" && category !== "coding") {
    notFound()
  }

  const flashCards = await getFlashCards(category)
  
  // If the error is happening here, the component isn't accepting these props
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category === "general" ? "General Knowledge" : "Coding"} Flash Cards
      </h1>
      <FlashCardReview 
        flashCards={flashCards} 
        category={category} 
      />
    </div>
  )
}