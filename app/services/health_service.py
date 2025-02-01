import os
from typing import Optional
from app.models.health_models import HealthRequest
from groq import Groq  # Import Groq directly

# Set your Groq API key
os.environ["GROQ_API_KEY"] = "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"  # Replace with your actual Groq API key

# Create the Groq client and set up the API key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Function to interact with Groq for health-related queries (without endpoint)
def get_groq_response(query: str) -> dict:
    # Create a prompt using Groq without the need for an endpoint
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": query}],
        model="deepseek-r1-distill-llama-70b",  # Use the model you want to run
    )

    response_content = chat_completion.choices[0].message.content

    # Format the response in a smart, structured way
    structured_response = {
        "food_suggestions": [],
        "recommendations": [],
        "alerts": [],
        "additional_notes": ""
    }

    # Dynamically parse the response for suggestions and restrictions
    structured_response["food_suggestions"] = parse_suggestions(response_content)
    structured_response["recommendations"] = parse_recommendations(response_content)
    structured_response["alerts"] = parse_alerts(response_content)
    structured_response["additional_notes"] = extract_additional_info(response_content)

    return structured_response

# Function to parse dynamic food suggestions from the response
def parse_suggestions(response_content: str) -> list:
    suggestions = []
    # Dynamically extracting food suggestions based on Groq's response
    if "suggest" in response_content.lower():
        # In reality, you'd need a better parsing method, but for now, we'll simulate dynamic suggestions
        suggestions = response_content.split('\n')  # Assuming suggestions are separated by newline
    return suggestions

# Function to parse dynamic health recommendations from the response
def parse_recommendations(response_content: str) -> list:
    recommendations = []
    if "recommend" in response_content.lower():
        recommendations = response_content.split('\n')  # Assuming recommendations are separated by newline
    return recommendations

# Function to parse dynamic alert messages for food restrictions based on diseases
def parse_alerts(response_content: str) -> list:
    alerts = []
    if "alert" in response_content.lower():
        alerts = response_content.split('\n')  # Assuming alerts are separated by newline
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
    # Construct a dynamic query to Groq
    query = f"Suggest food for someone with the following disease(s): {diseases}. Also, give alerts for food restrictions related to the disease(s) and a person with a BMI of {bmi}."
    response = get_groq_response(query)
    return response

# Function to provide food restrictions dynamically for any disease
def food_restrictions(diseases: Optional[str]) -> str:
    if diseases:
        query = f"Provide food restrictions for someone with the following disease(s): {diseases}."
        response = get_groq_response(query)
        return response['alerts']
    return "No food restrictions based on provided diseases."

# Function to provide full health summary, including dynamic food suggestions and restrictions
def full_health_summary(data: HealthRequest):
    # Calculate BMI
    bmi = calculate_bmi(data.weight, data.height)
    
    # Recommend daily calorie intake
    calories = recommend_calories(data)
    
    # Get dynamic food suggestions based on diseases and BMI
    food_suggestion = suggest_food(data.diseases, bmi)
    
    # Get food restrictions dynamically based on diseases
    restrictions = food_restrictions(data.diseases)
    
    return {
        "bmi": bmi,
        "recommended_calories": calories,
        "food_suggestions": food_suggestion["food_suggestions"],
        "recommendations": food_suggestion["recommendations"],
        "alerts": food_suggestion["alerts"],
        "food_restrictions": restrictions,
        "additional_notes": food_suggestion["additional_notes"]
    }
