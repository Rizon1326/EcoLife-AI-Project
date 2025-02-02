# app/routes/classify.py
from fastapi import APIRouter, UploadFile, HTTPException
from app.services.classify_service import classify_image
from app.services.sdg_analyzer import analyze_waste

router = APIRouter(
    prefix="/classify",  # Prefix for all routes in this file
    tags=["Classification"]  # Tags for documentation in Swagger UI
)

@router.post("/")
async def classify_waste(file: UploadFile):
    # Check if the uploaded file is an image (PNG, JPG, JPEG)
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG, JPEG)")
    
    # Classify the waste based on the uploaded image
    waste_type, details = classify_image(file)
    
    # Analyze the waste for SDG goals and recyclability
    # sdg_analysis = analyze_waste(waste_type)
    
    # Return a response containing the filename, waste type, details, and SDG analysis
    return {
        "filename": file.filename,
        "waste_type": waste_type,
        "details": details
    }
