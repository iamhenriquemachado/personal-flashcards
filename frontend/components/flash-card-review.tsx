"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { FlashCard } from "@/lib/types"; // Import the FlashCard type from your types file

interface FlashCardReviewProps {
  flashCards: FlashCard[];
  category: string;
}

export default function FlashCardReview({ flashCards, category }: FlashCardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Changed from number[] to string[] to match FlashCard.id type
  const [completed, setCompleted] = useState<string[]>([]);
  const [needsReview, setNeedsReview] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState(false);

  // Shuffle the cards when requested
  const shuffleCards = () => {
    setShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    toast({
      title: "Cards Shuffled",
      description: "The flashcards have been shuffled",
    });
  };

  // Move to the next card
  const nextCard = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      toast({
        title: "Completed",
        description: "You've reached the end of the deck",
      });
    }
  };

  // Move to the previous card
  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  // Mark card as completed (knew it)
  const markCompleted = () => {
    // Convert to string explicitly to ensure type compatibility
    const currentCardId = String(flashCards[currentIndex].id);
    
    if (!completed.includes(currentCardId)) {
      setCompleted(prev => [...prev, currentCardId]);
    }
    if (needsReview.includes(currentCardId)) {
      setNeedsReview(prev => prev.filter(id => id !== currentCardId));
    }
    nextCard();
  };

  // Mark card as needing review (didn't know it)
  const markNeedsReview = () => {
    // Convert to string explicitly to ensure type compatibility
    const currentCardId = String(flashCards[currentIndex].id);
    
    if (!needsReview.includes(currentCardId)) {
      setNeedsReview(prev => [...prev, currentCardId]);
    }
    if (completed.includes(currentCardId)) {
      setCompleted(prev => prev.filter(id => id !== currentCardId));
    }
    nextCard();
  };

  // Calculate progress percentage
  const progressPercentage = flashCards.length > 0
    ? Math.round(((completed.length + needsReview.length) / flashCards.length) * 100)
    : 0;

  // Get category badge class
  const getCategoryBadgeClass = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory === 'algorithms' || lowerCategory === 'coding') {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    } else if (lowerCategory === 'data structures') {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          {category === "general" ? "General Knowledge" : "Coding"} Flash Cards
        </h1>
        
        <div className="flex items-center gap-2">
          <Button onClick={shuffleCards} size="sm" variant="outline">
            <RotateCw className="mr-2 h-4 w-4" />
            Shuffle
          </Button>
        </div>
      </div>

      {flashCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No flashcards found for this category.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">
                Card {currentIndex + 1} of {flashCards.length}
              </span>
              <span className="text-sm">
                {completed.length} completed, {needsReview.length} need review
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card className="mb-6 min-h-64 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${getCategoryBadgeClass(category)}`}>
                  {category}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="text-center py-8">
              {!isFlipped ? (
                <div className="min-h-36 flex flex-col justify-center">
                  <h3 className="text-xl font-medium mb-6">{flashCards[currentIndex].question}</h3>
                  <Button variant="outline" onClick={() => setIsFlipped(true)}>
                    Reveal Answer
                  </Button>
                </div>
              ) : (
                <div className="min-h-36 space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Answer:</h4>
                    <p className="text-lg">{flashCards[currentIndex].answer}</p>
                  </div>
                  
                  {flashCards[currentIndex].explanation && (
                    <div>
                      <h4 className="font-medium mb-1">Explanation:</h4>
                      <p className="text-sm">{flashCards[currentIndex].explanation}</p>
                    </div>
                  )}
                  
                  {flashCards[currentIndex].code && (
                    <div>
                      <h4 className="font-medium mb-1">Code Example:</h4>
                      <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto text-left">
                        <code>{flashCards[currentIndex].code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="justify-between border-t pt-4">
              {isFlipped ? (
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm" onClick={() => setIsFlipped(false)}>
                    Hide Answer
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={markNeedsReview} variant="outline" size="sm">
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Need Review
                    </Button>
                    <Button onClick={markCompleted} variant="outline" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Got It
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-between">
                  <Button 
                    onClick={prevCard} 
                    disabled={currentIndex === 0} 
                    variant="outline" 
                    size="sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={nextCard} 
                    disabled={currentIndex === flashCards.length - 1} 
                    variant="outline" 
                    size="sm"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </>
      )}

      <Toaster />
    </div>
  );
}