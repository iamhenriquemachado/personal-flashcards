"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { fetchFlashCards, fetchAllFlashCards } from "@/lib/api";  // Import the fetchAllFlashCards function

// Define the Flashcard type
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: 'coding' | 'general';  
  explanation?: string;
  code?: string;  
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const fetchedCards = await fetchAllFlashCards();  // Fetch all flashcards
      console.log(fetchedCards);  // Debugging line to check the fetched data
      if (fetchedCards && fetchedCards.length > 0) {
        setFlashcards(fetchedCards);  // Update the state with fetched flashcards
      } else {
        console.log("No flashcards fetched");
      }
    };

    fetchCards();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Filter flashcards based on search term
  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCard = (id: string) => {
    setFlashcards(prevCards => prevCards.filter(card => card.id !== id));
    toast({
      title: "Deleted",
      description: "Flashcard has been deleted",
    });
  };

  const handleDeleteAll = () => {
    setFlashcards([]);
    setDeleteAllDialogOpen(false);
    toast({
      title: "All Deleted",
      description: "All flashcards have been deleted",
    });
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Input */}
      <div className="mb-6 flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search Flashcards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button variant="secondary">
          <Search size={16} />
        </Button>
      </div>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete All Flashcards</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Flashcards?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all flashcards? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flashcards List */}
      {filteredFlashcards.length === 0 ? (
        <p>No flashcards found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFlashcards.map(card => (
            <Card key={card.id} className="w-full">
              <CardHeader>
                <CardTitle>{card.question}</CardTitle>
                <CardDescription>{card.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>{expandedCard === card.id ? card.answer : "Click to expand"}</div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toggleCardExpansion(card.id)}>
                  {expandedCard === card.id ? "Hide Answer" : "Show Answer"}
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteCard(card.id)}>
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toaster />
    </div>
  );
}
