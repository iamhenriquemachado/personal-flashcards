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

export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    explanation: "",
    code: "",
    category: "general",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Error",
        description: "Question and answer are required",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send data to your backend
    // For now, we'll just show a success message

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
    })
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
              <Button type="submit" className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)]">
                Create Flash Card
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

