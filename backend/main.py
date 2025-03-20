from fastapi import FastAPI, APIRouter
from api import flashcards

app = FastAPI()
router = APIRouter()

# Test server
@app.get("/")
def server_running():
    return {"Message": "Server is running ✨"}

app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])

# Start server
if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 