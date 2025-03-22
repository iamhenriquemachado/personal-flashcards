"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createFlashCard } from "@/lib/api" // Import the API function

// Define the proper type for FlashCard
type FlashCardCategory = "general" | "coding";

// Type that matches the backend model
type FlashCardAPI = {
  id?: string;
  question: string;
  answer: string;
  explanation?: string | undefined;
  code?: string | undefined;
  category: FlashCardCategory;
  progress?: number | undefined;
}

// Type for form data - using empty strings for React form handling
type FlashCardFormData = {
  question: string;
  answer: string;
  explanation: string;
  code: string;
  category: FlashCardCategory;
  progress: number;
}

export default function CreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FlashCardFormData>({
    question: "",
    answer: "",
    explanation: "",
    code: "",
    category: "general",
    progress: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    // Cast the value to FlashCardCategory since we know it's constrained by the RadioGroup
    setFormData((prev) => ({
      ...prev,
      category: value as FlashCardCategory,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Error",
        description: "Question and answer are required",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Convert form data to API format with undefined for empty strings
      const apiData: FlashCardAPI = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        // Convert empty strings to undefined
        explanation: formData.explanation.trim() || undefined,
        code: formData.code.trim() || undefined,
        progress: formData.progress || undefined
      };
      
      // Send data to the API
      const result = await createFlashCard(apiData)
      
      if (result) {
        toast({
          title: "Success",
          description: "Flash card created successfully!",
          variant: "default",
        })
        
        // Reset form
        setFormData({
          question: "",
          answer: "",
          explanation: "",
          code: "",
          category: "general",
          progress: 0,
        })
        
        // Optional: Navigate back to the main page after successful creation
        // router.push("/")
      } else {
        throw new Error("Failed to create flash card")
      }
    } catch (error) {
      console.error("Error creating flash card:", error)
      toast({
        title: "Error",
        description: "Failed to create flash card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Flash Card</h1>

        <Card className="card-gradient-create border-[hsl(var(--success)/0.2)]">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[hsl(var(--success))]" />
                <span>New Flash Card</span>
              </CardTitle>
              <CardDescription>Fill in the details to create a new flash card</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <RadioGroup
                  defaultValue="general"
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general" className="cursor-pointer">
                      <span className="badge-general">General Knowledge</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coding" id="coding" />
                    <Label htmlFor="coding" className="cursor-pointer">
                      <span className="badge-coding">Coding</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  name="question"
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  placeholder="Enter the answer"
                  value={formData.answer}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">
                  Explanation <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="explanation"
                  name="explanation"
                  placeholder="Add additional explanation if needed"
                  value={formData.explanation}
                  onChange={handleChange}
                />
              </div>

              {formData.category === "coding" && (
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Code Snippet <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="code"
                    name="code"
                    placeholder="Add code snippet if applicable"
                    value={formData.code}
                    onChange={handleChange}
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Flash Card"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}