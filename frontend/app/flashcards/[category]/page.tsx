import { notFound } from "next/navigation";
import FlashCardReview from "@/components/flash-card-review";
import { fetchFlashCards } from "@/lib/api";
import { FlashCard } from "@/lib/types";

interface CategoryPageProps {
  params?: { category?: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Ensure params exists before accessing category
  if (!params || !params.category) {
    return notFound();
  }

  const category = params.category.toLowerCase(); // Normalize to lowercase

  // Validate category
  const validCategories = ["general", "coding"];
  if (!validCategories.includes(category)) {
    return notFound();
  }

  try {
    const flashCards: FlashCard[] = await fetchFlashCards(category);

    if (!flashCards || flashCards.length === 0) {
      return (
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">
            {category === "general" ? "General Knowledge" : "Coding"} Flash Cards
          </h1>
          <div className="text-center p-8 text-gray-500">
            No flashcards found for this category. Try again later.
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">
          {category === "general" ? "General Knowledge" : "Coding"} Flash Cards
        </h1>
        <FlashCardReview flashCards={flashCards} category={category} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Error Loading Flash Cards</h1>
        <div className="text-center p-8 text-red-500">
          Failed to fetch flashcards. Please try again later.
        </div>
      </div>
    );
  }
}
