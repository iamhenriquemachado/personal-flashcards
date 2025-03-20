from fastapi import FastAPI, APIRouter
from api import flashcards

app = FastAPI()
router = APIRouter()

app.include_router(flashcards.router, prefix="/api", tags=["api"])

# Test server
@router.get("/")
def server_running():
    return {"Message": "Server is running ✨"}

# Start server
if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 