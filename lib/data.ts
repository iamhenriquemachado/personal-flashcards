import type { FlashCard } from "./types"

// This is a mock function that would be replaced with actual API calls
export async function getFlashCards(category: string): Promise<FlashCard[]> {
  // In a real application, this would fetch from your backend API
  // For now, we'll return mock data

  if (category === "general") {
    return [
      {
        id: "g1",
        question: "What is the capital of France?",
        answer: "Paris",
        explanation: "Paris is the capital and most populous city of France.",
        category: "general",
      },
      {
        id: "g2",
        question: "Who wrote 'Romeo and Juliet'?",
        answer: "William Shakespeare",
        explanation:
          "William Shakespeare was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language.",
        category: "general",
      },
      {
        id: "g3",
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        explanation: "The symbol Au comes from the Latin word for gold, 'aurum'.",
        category: "general",
      },
      {
        id: "g4",
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter",
        explanation: "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
        category: "general",
      },
      {
        id: "g5",
        question: "What year did the Titanic sink?",
        answer: "1912",
        explanation:
          "The RMS Titanic sank in the North Atlantic Ocean on April 15, 1912, after colliding with an iceberg.",
        category: "general",
      },
    ]
  } else if (category === "coding") {
    return [
      {
        id: "c1",
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
        explanation: "HTML is the standard markup language for documents designed to be displayed in a web browser.",
        category: "coding",
      },
      {
        id: "c2",
        question: "What is a closure in JavaScript?",
        answer: "A function that has access to its own scope, the outer function's scope, and the global scope",
        explanation: "Closures are created every time a function is created, at function creation time.",
        category: "coding",
      },
      {
        id: "c3",
        question: "What does the following code do?",
        code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);",
        answer: "It creates a new array with each number doubled",
        explanation:
          "The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.",
        category: "coding",
      },
      {
        id: "c4",
        question: "What is the difference between '==' and '===' in JavaScript?",
        answer: "'==' compares values, '===' compares values and types",
        explanation:
          "The '==' operator performs type coercion, while the '===' operator does not perform type coercion.",
        category: "coding",
      },
      {
        id: "c5",
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        explanation:
          "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.",
        category: "coding",
      },
    ]
  }

  return []
}

