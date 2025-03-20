from fastapi import APIRouter, HTTPException
import logging
import json
from db.database import supabase, url, key


router = APIRouter()

# Setup logger
logger = logging.getLogger("uvicorn")


# Creates a new flashcard
router.post("/")
async def create_flashcard():
    pass 

@router.get('/get')
async def get_flashcards():
    try:
        response = supabase.table("flashcards").select("*").execute()

        return {
            "response": response.data
        }
    except Exception as e:
        logger.error(f"Error retrieving flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve flashcards: {str(e)}")
 

@router.get('/connection-test')
async def connection_test():
    from db.database import url, key
    
    # Import the libraries directly in this function to ensure we're using the same versions
    import os
    from supabase import create_client
    
    try:
        # Create a fresh client
        test_client = create_client(url, key)
        
        # Try a simple query
        test_query = test_client.table("flashcards").select("*").execute()
        
        return {
            "connection_status": "successful",
            "url_prefix": url[:10] + "..." if url else "Not set",
            "key_length": len(key) if key else "Not set",
            "data_count": len(test_query.data) if test_query.data else 0
        }
    except Exception as e:
        return {"error": str(e)}
    

@router.post('/insert-test')
async def insert_test():
    try:
        # Create a test flashcard
        test_data = {
            "created_at": "now()", 
            "question": "Test question",
            "answer": "Test answer",
            "explanation": "Test explanation", 
            "code": "Test code", 
            "category": "test"
             # Use Supabase's now() function
        }
        
        # Insert the test data
        insert_response = supabase.table("flashcards").insert(test_data).execute()
        
        # Fetch right after inserting
        fetch_response = supabase.table("flashcards").select("*").execute()
        
        return {
            "insert_status": "success" if insert_response.data else "failed",
            "inserted_data": insert_response.data,
            "fetch_after_insert": fetch_response.data,
            "count_after_insert": len(fetch_response.data) if fetch_response.data else 0
        }
    except Exception as e:
        return {"error": str(e)}