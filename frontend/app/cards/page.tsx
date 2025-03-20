"use client"

import { useState } from "react"
import { Trash2, AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock data - replace with actual API call
const mockFlashcards = [
  {
    id: "1",
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces",
    explanation: "React lets you create reusable UI components and efficiently update the DOM",
    code: "import React from 'react';\nconst App = () => <h1>Hello World</h1>;",
    category: "coding",
  },
  {
    id: "2",
    question: "What is the capital of France?",
    answer: "Paris",
    explanation: "Paris is the capital and most populous city of France",
    code: "",
    category: "general",
  },
  {
    id: "3",
    question: "What is a closure in JavaScript?",
    answer: "A function that has access to variables from its outer scope even after the outer function has returned",
    explanation: "Closures are useful for creating private variables and maintaining state",
    code: "function createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}",
    category: "coding",
  },
]

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState(mockFlashcards)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)

  // Filter flashcards based on search term
  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteCard = (id: string) => {
    setFlashcards(prevCards => prevCards.filter(card => card.id !== id))
    toast({
      title: "Deleted",
      description: "Flashcard has been deleted",
    })
  }

  const handleDeleteAll = () => {
    setFlashcards([])
    setDeleteAllDialogOpen(false)
    toast({
      title: "All Deleted",
      description: "All flashcards have been deleted",
    })
  }

  const toggleCardExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">My Flashcards</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={flashcards.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Delete All Flashcards
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete all flashcards? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {filteredFlashcards.length > 0 ? (
          <div className="grid gap-6">
            {filteredFlashcards.map((card) => (
              <Card key={card.id} className={`overflow-hidden ${card.category === 'coding' ? 'card-gradient-coding' : 'card-gradient-general'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block mb-2 ${card.category === 'coding' ? 'badge-coding' : 'badge-general'}`}>
                        {card.category === 'coding' ? 'Coding' : 'General Knowledge'}
                      </span>
                      <CardTitle className="text-xl">{card.question}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive -mt-2 -mr-2"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`cursor-pointer transition-all duration-300 ${expandedCard === card.id ? '' : 'line-clamp-3'}`}
                    onClick={() => toggleCardExpansion(card.id)}
                  >
                    <p className="font-medium">Answer: {card.answer}</p>
                    
                    {card.explanation && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Explanation:</p>
                        <p className="mt-1">{card.explanation}</p>
                      </div>
                    )}
                    
                    {card.category === 'coding' && card.code && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Code:</p>
                        <pre className="mt-1 p-3 bg-muted rounded-md font-mono text-sm overflow-x-auto">
                          {card.code}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="text-xs text-muted-foreground"
                    onClick={() => toggleCardExpansion(card.id)}
                  >
                    {expandedCard === card.id ? 'Show Less' : 'Show More'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No flashcards found matching your search.' : 'No flashcards created yet.'}
            </p>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/create'}>
              Create Your First Flashcard
            </Button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}