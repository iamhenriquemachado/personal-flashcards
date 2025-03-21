"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, Plus, BookOpen, Code, Eye, EyeOff, Filter, X } from "lucide-react";
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
import { fetchFlashCards, fetchAllFlashCards } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlashCard } from "@/lib/types"


export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchAllFlashCards();
        console.log(fetchedData);
        
        // Extract the response array from the returned object
        const fetchedCards = fetchedData.response;
        
        if (fetchedCards && fetchedCards.length > 0) {
          setFlashcards(fetchedCards);
        } else {
          console.log("No flashcards fetched");
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        toast({
          title: "Error",
          description: "Failed to load flashcards. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchCards();
  }, []);

  // Filter flashcards based on search term and active tab
  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && card.category === activeTab;
  });

  const handleDeleteCard = (id: string) => {
    setFlashcards(prevCards => prevCards.filter(card => card.id !== id));
    toast({
      title: "Success",
      description: "Flashcard has been deleted",
      variant: "default",
    });
  };

  const handleDeleteAll = () => {
    setFlashcards([]);
    setDeleteAllDialogOpen(false);
    toast({
      title: "Success",
      description: "All flashcards have been deleted",
      variant: "default",
    });
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
            <p className="text-muted-foreground">
              Review and manage your learning flashcards
            </p>
          </div>
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Flashcard
          </Button>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions, answers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("coding")}>
                Coding
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("general")}>
                General
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full md:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
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
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status Display */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredFlashcards.length === 0 && !loading
              ? "No flashcards found"
              : `Showing ${filteredFlashcards.length} flashcard${filteredFlashcards.length !== 1 ? 's' : ''}`}
          </p>
          {activeTab !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {activeTab}
              <button onClick={() => setActiveTab("all")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {/* Empty State */}
        {filteredFlashcards.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No flashcards found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first flashcard"}
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Flashcard
            </Button>
          </div>
        )}

        {/* Flashcards Grid */}
        {filteredFlashcards.length > 0 && !loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFlashcards.map(card => (
              <Card key={card.id} className="flex h-full flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={card.category === 'coding' ? 'secondary' : 'outline'} className="mb-2">
                        {card.category === 'coding' ? <Code className="mr-1 h-3 w-3" /> : null}
                        {card.category}
                      </Badge>
                      <CardTitle className="line-clamp-2 text-lg">{card.question}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className={`rounded-md p-3 ${expandedCard === card.id ? 'bg-accent' : 'bg-muted/50'}`}>
                    {expandedCard === card.id ? (
                      <div className="space-y-2">
                        <p className="font-medium">Answer:</p>
                        <p>{card.answer}</p>
                        
                        {card.explanation && (
                          <>
                            <p className="font-medium mt-4">Explanation:</p>
                            <p className="text-sm text-muted-foreground">{card.explanation}</p>
                          </>
                        )}
                        
                        {card.code && (
                          <>
                            <p className="font-medium mt-4">Code:</p>
                            <pre className="mt-2 rounded bg-muted p-2 text-xs">
                              <code>{card.code}</code>
                            </pre>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4 text-muted-foreground">
                        <Eye className="mr-2 h-4 w-4" />
                        Click to reveal answer
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCardExpansion(card.id)}
                    className="w-full"
                  >
                    {expandedCard === card.id ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Show Answer
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    className="ml-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      <Toaster />
    </div>
  );
}