"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCw, ThumbsUp, ThumbsDown, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import { FlashCard } from "@/lib/types";

interface FlashCardReviewProps {
  flashCards: FlashCard[];
  category: string;
}

export default function FlashCardReview({ flashCards, category }: FlashCardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [needsReview, setNeedsReview] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        setIsFlipped(!isFlipped);
      } else if (e.key === "ArrowRight" && !isFlipped) {
        nextCard();
      } else if (e.key === "ArrowLeft" && !isFlipped) {
        prevCard();
      } else if (e.key === "y" && isFlipped) {
        markCompleted();
      } else if (e.key === "n" && isFlipped) {
        markNeedsReview();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex]);

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

  // Move to the next card with animation
  const nextCard = () => {
    if (currentIndex < flashCards.length - 1) {
      setTransitionDirection('next');
      setIsExiting(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setIsExiting(false);
      }, 200);
    } else {
      toast({
        title: "Completed",
        description: "You've reached the end of the deck",
      });
    }
  };

  // Move to the previous card with animation
  const prevCard = () => {
    if (currentIndex > 0) {
      setTransitionDirection('prev');
      setIsExiting(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsFlipped(false);
        setIsExiting(false);
      }, 200);
    }
  };

  // Mark card as completed (knew it)
  const markCompleted = () => {
    const currentCardId = String(flashCards[currentIndex].id);
    
    if (!completed.includes(currentCardId)) {
      setCompleted(prev => [...prev, currentCardId]);
    }
    if (needsReview.includes(currentCardId)) {
      setNeedsReview(prev => prev.filter(id => id !== currentCardId));
    }
    
    toast({
      title: "Great job!",
      description: "Card marked as completed",
      variant: "default",
    });
    
    nextCard();
  };

  // Mark card as needing review (didn't know it)
  const markNeedsReview = () => {
    const currentCardId = String(flashCards[currentIndex].id);
    
    if (!needsReview.includes(currentCardId)) {
      setNeedsReview(prev => [...prev, currentCardId]);
    }
    if (completed.includes(currentCardId)) {
      setCompleted(prev => prev.filter(id => id !== currentCardId));
    }
    
    toast({
      title: "No problem",
      description: "Card added to review list",
      variant: "default",
    });
    
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
  
  // Get current card status
  const getCurrentCardStatus = () => {
    const currentCardId = String(flashCards[currentIndex].id);
    if (completed.includes(currentCardId)) return "completed";
    if (needsReview.includes(currentCardId)) return "review";
    return "pending";
  };

  // Get animation class based on transition state
  const getCardAnimationClass = () => {
    if (!isExiting) return "opacity-100 translate-y-0";
    if (transitionDirection === 'next') return "opacity-0 -translate-y-4";
    if (transitionDirection === 'prev') return "opacity-0 translate-y-4";
    return "opacity-100 translate-y-0";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            {category === "general" ? "General Knowledge" : category} Flash Cards
          </h1>
          <p className="text-muted-foreground">Master your knowledge one card at a time</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={shuffleCards} size="sm" variant="outline" className="group transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
            <RotateCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-all duration-300" />
            Shuffle
          </Button>
        </div>
      </div>

      {flashCards.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="pt-6">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">No flashcards found</p>
            <p className="text-muted-foreground">There are no flashcards available for this category.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Card {currentIndex + 1} of {flashCards.length}
              </span>
              <div className="flex gap-4">
                <span className="text-sm flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                  {completed.length} completed
                </span>
                <span className="text-sm flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-1 text-amber-500" />
                  {needsReview.length} to review
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-muted" />
          </div>

          <div className={`perspective-1000 w-full transition-all duration-300 ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div 
              className={`transition-all duration-200 ${getCardAnimationClass()}`}
              key={currentIndex}
            >
              <Card className="mb-6 shadow-lg border-2 hover:border-primary/20 transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={getCategoryBadgeClass(category)}>
                      {category}
                    </Badge>
                    
                    {getCurrentCardStatus() === "completed" && (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        <ThumbsUp className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                    
                    {getCurrentCardStatus() === "review" && (
                      <Badge variant="outline" className="bg-amber-500 hover:bg-amber-600 text-white">
                        <ThumbsDown className="h-3 w-3 mr-1" /> Needs Review
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="text-center py-12 px-8">
                  {!isFlipped ? (
                    <div className="min-h-52 flex flex-col justify-center">
                      <h3 className="text-2xl font-medium mb-8">{flashCards[currentIndex].question}</h3>
                      <Button onClick={() => setIsFlipped(true)} className="mx-auto w-40 transition-all duration-300 hover:scale-105">
                        Reveal Answer
                      </Button>
                      <div className="mt-4 text-xs text-muted-foreground">
                        Press <kbd className="px-1 py-0.5 bg-muted rounded border">Space</kbd> to flip
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-52 space-y-6">
                      <div>
                        <h4 className="font-medium mb-2 text-primary">Answer:</h4>
                        <p className="text-xl">{flashCards[currentIndex].answer}</p>
                      </div>
                      
                      {flashCards[currentIndex].explanation && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-1 text-primary">Explanation:</h4>
                          <p className="text-sm">{flashCards[currentIndex].explanation}</p>
                        </div>
                      )}
                      
                      {flashCards[currentIndex].code && (
                        <div>
                          <h4 className="font-medium mb-1 text-primary">Code Example:</h4>
                          <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto text-left shadow-inner">
                            <code>{flashCards[currentIndex].code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="justify-between border-t pt-4 bg-muted/30">
                  {isFlipped ? (
                    <div className="flex w-full justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setIsFlipped(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Hide Answer
                      </Button>
                      <div className="flex gap-3">
                        <Button 
                          onClick={markNeedsReview} 
                          variant="outline" 
                          size="sm"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Need Review
                        </Button>
                        <Button 
                          onClick={markCompleted} 
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        >
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
                        variant="ghost" 
                        size="sm"
                        className="transition-all duration-200 hover:translate-x-[-2px]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button 
                        onClick={nextCard} 
                        disabled={currentIndex === flashCards.length - 1} 
                        variant="ghost" 
                        size="sm"
                        className="transition-all duration-200 hover:translate-x-[2px]"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Keyboard shortcuts</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span><kbd className="px-2 py-1 bg-muted rounded border">Space</kbd> Flip card</span>
              <span><kbd className="px-2 py-1 bg-muted rounded border">←</kbd> Previous card</span>
              <span><kbd className="px-2 py-1 bg-muted rounded border">→</kbd> Next card</span>
              <span><kbd className="px-2 py-1 bg-muted rounded border">Y</kbd> Got it</span>
              <span><kbd className="px-2 py-1 bg-muted rounded border">N</kbd> Need review</span>
            </div>
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
} 