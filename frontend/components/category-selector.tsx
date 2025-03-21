// components/category-selector.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  currentCategory: string;
}

export default function CategorySelector({ currentCategory }: CategorySelectorProps) {
  const categories = [
    { id: "general", name: "General Knowledge" },
    { id: "coding", name: "Coding" }
  ];
  
  return (
    <div className="flex gap-2 mb-6 p-4">
      {categories.map((category) => (
        <Link href={`/flashcards/${category.id}`} key={category.id}>
          <Button 
            variant={currentCategory === category.id ? "default" : "outline"}
            className="transition-all duration-300"
          >
            {category.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}