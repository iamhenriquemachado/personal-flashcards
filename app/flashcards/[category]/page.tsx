import { notFound } from "next/navigation"
import { FlashCardReview } from "@/components/flash-card-review"
import { getFlashCards } from "@/lib/data"

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  if (category !== "general" && category !== "coding") {
    notFound()
  }

  const flashCards = await getFlashCards(category)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-8 text-center ${
            category === "general"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text"
              : "bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text"
          }`}
        >
          {category === "general" ? "General Knowledge" : "Coding"} Flash Cards
        </h1>

        <FlashCardReview flashCards={flashCards} category={category} />
      </div>
    </div>
  )
}

