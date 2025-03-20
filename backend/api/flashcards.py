from fastapi import APIRouter, HTTPException
import logging

router = APIRouter()

# Setup logger
logger = logging.getLogger("uvicorn")