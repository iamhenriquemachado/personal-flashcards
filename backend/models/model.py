from pydantic import BaseModel

class FlashCards(BaseModel):
    id: int
    question: str
    answer: str
    explanation: str
    code: str
    category: int