# Remove the import statement that causes the circular import
# from app.services.classify_service import classify_image  # <-- REMOVE THIS LINE

import os
from transformers import pipeline
from app.utils.file_handler import save_temp_image
from PIL import Image
import google.generativeai as genai

# Initialize the Hugging Face model
classifier = pipeline("image-classification", model="microsoft/swin-tiny-patch4-window7-224")

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCRJWPgakOG1RMCU7m9Q3UvnRuhBn9LyCA"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(waste_description: str) -> str:
    """Get detailed information about waste disposal from Gemini"""
    prompt = f"""
    Based on the image classification result '{waste_description}', provide a detailed waste management response covering:
    1. what sdg goal is being addressed by the waste
    2. What type of waste this likely represents. 
    3. How it affects soil, water, and air if improperly disposed of.
    4. How it can be harmful to humans and animals.
    5. What are the best methods for safe disposal or recycling?
    Please provide specific details about proper handling and disposal methods.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Unable to generate detailed analysis: {str(e)}"

def process_classification_results(label: str, score: float) -> dict:
    """Process the model's classification label into waste details"""
    return {
        "type": label,  # Keep the original model classification
        "confidence_score": score,
        "description": f"Classification based on image analysis: {label}",
        "recyclable": None,  # This will be determined by Gemini's analysis
    }

def classify_image(uploaded_file):
    """Classify waste from an uploaded image using direct model output"""
    try:
        # Save and load the image
        image_path = save_temp_image(uploaded_file)
        image = Image.open(image_path)
        
        # Get classification results from the Swin Transformer model
        results = classifier(image)
        
        # Store all classification details
        all_predictions = [{"label": r["label"], "score": r["score"]} for r in results]
        
        # Process the top prediction (highest confidence score)
        if results and results[0]["score"] >= 0.15:  # Minimum confidence threshold
            top_prediction = results[0]
            
            # Process the classification result
            waste_details = process_classification_results(
                top_prediction["label"],
                top_prediction["score"]
            )
            
            # Step 1: Pass the top-level classification label to Gemini for detailed identification
            gemini_insights = get_gemini_response(top_prediction["label"])
            waste_details["waste_analysis"] = gemini_insights
            
        else:
            waste_details = {
                "type": "Unidentified",
                "confidence_score": 0,
                "description": "Could not confidently classify the image.",
                "recyclable": None,
                "waste_analysis": "Unable to provide detailed analysis due to low confidence classification."
            }
        
        return waste_details, all_predictions
        
    except Exception as e:
        error_response = {
            "type": "Error",
            "confidence_score": 0,
            "description": f"Error during classification: {str(e)}",
            "recyclable": None,
            "waste_analysis": "An error occurred during the analysis process."
        }
        return error_response, []

def cleanup_temp_files(image_path):
    """Clean up temporary files after processing"""
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print(f"Error cleaning up temporary files: {str(e)}")
