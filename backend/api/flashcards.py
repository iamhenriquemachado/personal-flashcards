from fastapi import APIRouter, HTTPException
import logging
from db.database import supabase
from models.model import FlashCards
from datetime import datetime, timezone
import html

# Setup logger and router
router = APIRouter()
logger = logging.getLogger("uvicorn")

# Test server
@router.get("/")
def server_running():
    return {"Message": "Server is running ✨"}

# Get All Flashcards
@router.get('/flashcards')
async def get_flashcards():
    try:
        response = supabase.table("flashcards").select("*").execute()

        return {
            "response": response.data
        }
    except Exception as e:
        logger.error(f"Error retrieving flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve flashcards: {str(e)}")
    
# Craete Flashcard
@router.post("/flashcards/create")
async def create_flashcards(flashcard_data: FlashCards):
    try:
            # Protects against SQL Injection and XSS Attacks
            flashcard_data.question = html.escape(flashcard_data.question)
            flashcard_data.answer = html.escape(flashcard_data.answer)
            flashcard_data.explanation = html.escape(flashcard_data.explanation or "")
            flashcard_data.code = html.escape(flashcard_data.code or "")


            created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
            flashcard_dict = flashcard_data.model_dump()
            flashcard_dict["created_at"] = created_at
            
            
            # Validate allowed categories
            ALLOWED_CATEGORIES = {"general", "coding"}
            if flashcard_data.category.lower() not in ALLOWED_CATEGORIES:
                 raise HTTPException(status_code=400, detail="Invalid category")

            # Return the response with the flashcard created 
            response = supabase.table("flashcards").insert(flashcard_dict).execute()
            return { "flashcard": response.data }
    
    except Exception as e:
            logger.error(f"Error retrieving flashcards: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to insert new flashcard: {str(e)}")

 
# Update Flashcard
@router.patch("/flashcards/update/{id}")
async def update_flashcard(id: int, flashcard_data: FlashCards):
     try:
          # Check if a flashcard exists in the database
          existing_flashcard = (supabase.table("flashcards").select("id").eq("id", id).execute())    
          if not existing_flashcard.data:  
            raise HTTPException(status_code=400, detail="Flashcard does not exist")

          # Update the new flashcard
          flashcard_dict = flashcard_data.model_dump()
          response = supabase.table("flashcards").update(flashcard_dict).eq("id", id).execute()
          
          return {
               "message": "Flashcard updated sucessfully in the database", 
               "flashcard": response.data
          }
          
     except Exception as e:
            logger.error(f"Error retrie ving flashcards: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to update the flashcard: {str(e)}")

# Delete Flashcard
@router.delete("/flashcards/delete/{id}")
async def delete_flashcard(id: int):
        try:
            # Check if a flashcard exists in the database
            existing_flashcard = (supabase.table("flashcards").select("id").eq("id", id).execute())    
            if not existing_flashcard.data:  
                raise HTTPException(status_code=400, detail="Flashcard does not exist")

            # Delete a flashcard 
            response = supabase.table("flashcards").delete().eq("id", id).execute()
            
            return {
                "message": "Flashcard deleted sucessfully in the database", 
                "flashcard": response.data
            }
          
        except Exception as e:
            logger.error(f"Error deleting flashcards: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to delete the flashcard: {str(e)}")
        

@router.patch("/flashcards/progress/{id}")
async def flashcard_progress(id: int, flashcard_data: FlashCards):
    try:
    # Check if a flashcard exists in the database
        existing_flashcard = (supabase.table("flashcards").select("id").eq("id", id).execute())    
        if not existing_flashcard.data:  
            raise HTTPException(status_code=400, detail="Flashcard does not exist")
        
        response = (
            supabase.table("flashcards")
            .update({"progress": flashcard_data.progress})
            .eq("id", id)
            .execute()
        )
        
        return {"message": "Progress updated", "flashcard": response.data}

    except Exception as e:
        logger.error(f"Error updating flashcard progress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update the flashcard: {str(e)}")

# Get Progress For All Flashcards
@router.get('/flashcards/progress')
async def get_flashcards():
    try:
        response = supabase.table("flashcards").select("question", "progress").execute()
        return {
            "response": response.data
        }
    except Exception as e:
        logger.error(f"Error retrieving flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve flashcards: {str(e)}")
    

# Get Flashcards By Category
@router.get('/flashcards/category/{category}')
async def get_flashcards_by_category(category: str):
    try:
        response = supabase.table("flashcards").select("*").eq("category", category).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error retrieving flashcards for category {category}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve flashcards: {str(e)}")