# app/services/food_recommendation_service.py
import os
from groq import Groq
from app.models.food_recommendation_models import FoodRecommendationRequest

# Set your Groq API key
os.environ["GROQ_API_KEY"] = "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"  # Replace with your actual Groq API key

# Create the Groq client and set up the API key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Function to interact with Groq for food recommendations based on diseases, BMI, and specific food
def get_food_recommendations(query: str) -> dict:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": query}],
        model="deepseek-r1-distill-llama-70b",  # Use the model you want to run
    )

    response_content = chat_completion.choices[0].message.content

    # Format the response in a structured way
    structured_response = {
        "food_suggestions": [],
        "recommendations": [],
        "alerts": [],
        "additional_notes": "",
        "specific_food_intake": {},
    }

    # Parse dynamic suggestions, recommendations, and alerts
    structured_response["food_suggestions"] = parse_suggestions(response_content)
    structured_response["recommendations"] = parse_recommendations(response_content)
    structured_response["alerts"] = parse_alerts(response_content)
    structured_response["additional_notes"] = extract_additional_info(response_content)

    # If a specific food is requested, provide daily and weekly intake recommendations
    structured_response["specific_food_intake"] = get_specific_food_intake(response_content)

    return structured_response

# Function to parse dynamic food suggestions
def parse_suggestions(response_content: str) -> list:
    suggestions = []
    if "suggest" in response_content.lower():
        suggestions = response_content.split('\n')
    return suggestions

# Function to parse health recommendations
def parse_recommendations(response_content: str) -> list:
    recommendations = []
    if "recommend" in response_content.lower():
        recommendations = response_content.split('\n')
    return recommendations

# Function to parse alerts for food restrictions
def parse_alerts(response_content: str) -> list:
    alerts = []
    if "alert" in response_content.lower():
        alerts = response_content.split('\n')
    return alerts

# Function to extract additional information
def extract_additional_info(response_content: str) -> str:
    return "Consult with your healthcare provider for personalized dietary recommendations."

# Function to handle specific food intake (both daily and weekly)
def get_specific_food_intake(response_content: str) -> dict:
    specific_food_intake = {}
    
    # Example response format, assuming we can extract the intake information
    if "specific food" in response_content.lower():
        # Assuming that Groq's response has intake recommendations like daily/weekly quantities for specific food
        lines = response_content.split('\n')
        for line in lines:
            if "intake" in line.lower():  # Look for intake info
                food_name = line.split(':')[0].strip()
                intake_info = line.split(':')[1].strip()
                specific_food_intake[food_name] = intake_info
    
    return specific_food_intake
