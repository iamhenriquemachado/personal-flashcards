import Link from "next/link"
import { BookOpen, Code, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
            Flash Cards
          </h1>
          <p className="text-muted-foreground">Enhance your learning with interactive flash cards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow card-gradient-general border-[hsl(var(--info)/0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[hsl(var(--info))]" />
                <span>General Knowledge</span>
              </CardTitle>
              <CardDescription>Review general knowledge topics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Explore a variety of general knowledge topics including history, science, geography, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/flashcards/general" className="w-full">
                <Button className="w-full bg-[hsl(var(--info))] hover:bg-[hsl(var(--info)/0.9)]">
                  Start Reviewing
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow card-gradient-coding border-[hsl(var(--accent)/0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[hsl(var(--accent))]" />
                <span>Coding</span>
              </CardTitle>
              <CardDescription>Practice programming concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Review coding concepts, algorithms, data structures, and language-specific syntax to improve your
                programming skills.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/flashcards/coding" className="w-full">
                <Button className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)]">
                  Start Reviewing
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow card-gradient-create border-[hsl(var(--success)/0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-[hsl(var(--success))]" />
                <span>Create New</span>
              </CardTitle>
              <CardDescription>Add your own flash cards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Create custom flash cards for any topic you're learning. Add questions, answers, and explanations to
                build your personal collection.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/create" className="w-full">
                <Button className="w-full bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)]">
                  Create Cards
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

