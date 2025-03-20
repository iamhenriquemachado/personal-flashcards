from pydantic import BaseModel, Field
from typing import Optional

class FlashCards(BaseModel):
    question: str = Field(..., min_length=5, max_length=500, description="Flashcard question")
    answer: str = Field(..., min_length=1, max_length=1000, description="Flashcard answer")
    explanation: Optional[str] = Field(None, max_length=2000, description="Optional explanation")
    code: Optional[str] = Field(None, max_length=5000, description="Optional code snippet")
    category: str = Field(..., min_length=3, max_length=50, description="Category of the flashcard")