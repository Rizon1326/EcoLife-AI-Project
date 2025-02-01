import os
import re
from typing import Optional
from app.models.health_models import HealthRequest
from groq import Groq  # Import Groq directly

# Set your Groq API key
os.environ["GROQ_API_KEY"] = "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"  # Replace with your actual Groq API key

# Create the Groq client and set up the API key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Function to clean the Groq response by removing unnecessary parts (e.g., <think>)
def clean_response(response_content: str) -> str:
    # Remove <think> sections
    response_content = re.sub(r'<think>.*?</think>', '', response_content, flags=re.DOTALL)
    
    # Convert markdown to HTML
    response_content = re.sub(r'### (.*?)', r'<h3>\1</h3>', response_content)
    response_content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', response_content)
    response_content = re.sub(r'\* (.*?)(\n|$)', r'<li>\1</li>', response_content)
    response_content = re.sub(r'(\n<li>.*?</li>)+', r'<ul>\g<0></ul>', response_content)
    
    return response_content

# Function to interact with Groq for health-related queries
def get_groq_response(query: str) -> dict:
    # Create a prompt using Groq without the need for an endpoint
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": query}],
        model="deepseek-r1-distill-llama-70b",  # Use the model you want to run
    )

    response_content = chat_completion.choices[0].message.content

    # Clean the response
    cleaned_response = clean_response(response_content)

    # Format the response in a smart, structured way
    structured_response = {
        "food_suggestions": parse_suggestions(cleaned_response),
        "recommendations": parse_recommendations(cleaned_response),
        "alerts": parse_alerts(cleaned_response),
        "additional_notes": extract_additional_info(cleaned_response)
    }

    return structured_response

# Function to parse dynamic food suggestions from the response
def parse_suggestions(response_content: str) -> list:
    suggestions = []
    if "suggest" in response_content.lower():
        suggestions = response_content.split('\n')  # Assuming suggestions are separated by newline
    
    # Ensure the suggestions are clean and free from unwanted characters (like '#')
    suggestions = [suggestion.strip().replace("#", "") for suggestion in suggestions if suggestion.strip()]
    
    return suggestions


# Function to parse dynamic health recommendations from the response
def parse_recommendations(response_content: str) -> list:
    recommendations = []
    if "recommend" in response_content.lower():
        recommendations = response_content.split('\n')  # Assuming recommendations are separated by newline
    # Shorten recommendations for clarity
    recommendations = [recommendation.strip() for recommendation in recommendations if recommendation.strip()]
    return recommendations

# Function to parse dynamic alert messages for food restrictions based on diseases
def parse_alerts(response_content: str) -> list:
    alerts = []
    if "alert" in response_content.lower():
        alerts = response_content.split('\n')  # Assuming alerts are separated by newline
    # Shorten and clean alerts
    alerts = [alert.strip() for alert in alerts if alert.strip()]
    return alerts

# Function to extract additional information from the Groq response
def extract_additional_info(response_content: str) -> str:
    # Placeholder logic for extracting any additional information from Groq's response
    return "Consult with your healthcare provider for personalized dietary recommendations."

# Function to calculate BMI
def calculate_bmi(weight: float, height: float) -> float:
    height_m = height / 100  # Convert height to meters
    return weight / (height_m ** 2)

# Function to calculate energy loss based on gender, pregnancy, period, and activity level
def calculate_energy_loss(age: int, weight: float, height: float, gender: str, pregnancy: Optional[bool], period: Optional[bool], activity_level: str) -> float:
    # Basal Metabolic Rate (BMR) calculation (Mifflin-St Jeor Equation)
    if gender == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:  # female
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    
    # Adjust BMR based on activity level
    if activity_level.lower() == "sedentary":
        bmr *= 1.2
    elif activity_level.lower() == "moderate":
        bmr *= 1.55
    elif activity_level.lower() == "active":
        bmr *= 1.75
    
    # Additional energy adjustments for females
    if pregnancy:
        bmr += 300  # Adding extra calories for pregnancy
    if period:
        bmr += 100  # Adding extra calories for menstrual cycle
    
    return bmr

# Function to provide calorie intake recommendation
def recommend_calories(data: HealthRequest) -> float:
    energy_loss = calculate_energy_loss(data.age, data.weight, data.height, data.gender, data.pregnancy, data.period, data.daily_activities)
    return energy_loss

# Function to provide food suggestions based on disease and BMI
def suggest_food(diseases: Optional[str], bmi: float) -> str:
    query = f"""Suggest appropriate foods for someone with the following condition(s): {diseases}. Also, provide food restrictions based on the condition(s) and a BMI of {bmi}.Ensure the response is concise and systematic, with short, sharp sentences. Present the food recommendations in a neat and clear with nutrition details and portion sizes. """
    response = get_groq_response(query)
    return response

# Function to provide food restrictions dynamically for any disease
def food_restrictions(diseases: Optional[str]) -> str:
    if diseases:
        query = f"Provide food restrictions for someone with the following disease(s): {diseases}. Just give me the food and their reasons . And every reason contains a short sentence. The sentences should be more smarter and short." 
        response = get_groq_response(query)
        return response['alerts']
    return "No food restrictions based on provided diseases."

# Function to provide full health summary, including dynamic food suggestions and restrictions
def full_health_summary(data: HealthRequest):
    bmi = calculate_bmi(data.weight, data.height)
    calories = recommend_calories(data)
    food_suggestion = suggest_food(data.diseases, bmi)
    restrictions = food_restrictions(data.diseases)
    
    # Return the formatted health summary
    return {
        "bmi": bmi,
        "recommended_calories": calories,
        "food_suggestions": format_list(food_suggestion["food_suggestions"]),
        "recommendations": format_list(food_suggestion["recommendations"]),
        "alerts": format_list(food_suggestion["alerts"]),
        "food_restrictions": format_list(restrictions),
        "additional_notes": food_suggestion["additional_notes"]
    }

# Utility function to format a list for better display
def format_list(items):
    return [item.strip() for item in items if item.strip()]