import json
import os
from transformers import pipeline
from app.utils.file_handler import save_temp_image
from PIL import Image
from groq import Groq  # Import Groq

# Load the enhanced waste details JSON
with open("app/models/waste_details1.json", "r") as file:
    waste_details = json.load(file)

# Initialize the Hugging Face model
classifier = pipeline("image-classification", model="microsoft/swin-tiny-patch4-window7-224")

# Set your Groq API key
os.environ["GROQ_API_KEY"] = "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"  # Replace with your actual Groq API key

# Create the Groq client and set up the API key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Function to interact with Groq for waste disposal and recycling information
def get_groq_response(waste_type: str) -> dict:
    query = f"""
    Provide a detailed response for {waste_type} based on the following:
    1. How does it affect soil, water, and air?
    2. How is it harmful to humans and animals?
    3. What are the best methods for safe disposal of this waste?
    If it is recyclable, explain the recycling process as well.
    """

    # Create a prompt using Groq
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": query}],
        model="deepseek-r1-distill-llama-70b",  # Use the model you want to run
    )

    response_content = chat_completion.choices[0].message.content

    # Return the structured response
    return response_content

def classify_image(uploaded_file):
    image_path = save_temp_image(uploaded_file)

    # Load the image using PIL
    image = Image.open(image_path)

    # Step 1: Classify using the Swin Transformer model
    results = classifier(image)
    details = [{"label": r["label"], "score": r["score"]} for r in results]

    # Step 2: Map labels to waste types with detailed information
    confidence_threshold = 0.15  # Minimum score for a label to be considered
    cumulative_scores = {}
    waste_type_details = None

    for result in results:
        label = result["label"].lower()
        score = result["score"]

        if score >= confidence_threshold:
            # Match substrings to determine waste type
            matched_waste_info = None

            # Try matching the label with waste details
            for waste_info in waste_details:  # Iterate over the list of waste details
                if waste_info["label"].lower() in label:
                    matched_waste_info = waste_info
                    waste_type = waste_info["type"]
                    if waste_type not in cumulative_scores:
                        cumulative_scores[waste_type] = 0
                    cumulative_scores[waste_type] += score

            # If a matching waste type is found, use it
            if matched_waste_info:
                waste_type_details = matched_waste_info

    # Step 3: Determine the waste type with the highest cumulative score
    if cumulative_scores:
        final_type = max(cumulative_scores, key=cumulative_scores.get)
        waste_type_details = next((item for item in waste_details if item["type"] == final_type), None)

    if not waste_type_details:
        waste_type_details = {
            "type": "Unknown",
            "description": "Could not classify the waste.",
            "harmful_scale": 0,
            "harmful_effects": "Unknown",
            "recyclable": False
        }

    # Now, get additional information from Groq about environmental impact and disposal
    if waste_type_details["type"] != "Unknown":
        groq_info = get_groq_response(waste_type_details["type"])
    else:
        groq_info = "No additional insights available for this waste type."

    waste_type_details["groq_insights"] = groq_info

    return waste_type_details, details
