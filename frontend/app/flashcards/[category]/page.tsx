import { notFound } from "next/navigation";
import FlashCardReview from "@/components/flash-card-review";
import { fetchFlashCards } from "@/lib/api";
import { FlashCard } from "@/lib/types";

interface CategoryPageProps {
  params: {
    category?: string | undefined;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Log params to debug
  console.log("Received params:", params);
  
  // Ensure params.category exists and is a string
  if (!params || typeof params.category !== 'string' || params.category.trim() === '') {
    console.log("Invalid category parameter, redirecting to 404");
    return notFound();
  }
  
  const category = params.category.toLowerCase(); // Now safe to call toLowerCase()
  console.log("Fetching flash cards for category:", category);
  
  // Validate category
  const validCategories = ["general", "coding"];
  if (!validCategories.includes(category)) {
    console.log("Category not in valid list:", category);
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
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
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
        <h1 className="text-2xl font-bold mb-6">
          Error Loading Flash Cards
        </h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          Failed to fetch flashcards. Please try again later.
        </div>
      </div>
    );
  }
}