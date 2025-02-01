from fastapi import APIRouter
from app.models.food_recommendation_models import FoodRecommendationRequest  # Import the food recommendation model
from app.services.food_recommendation_service import get_food_recommendations  # Import the service

router = APIRouter(
    prefix="/food-recommendation",
    tags=["Food Recommendations"]
)

@router.post("/")
async def recommend_food(data: FoodRecommendationRequest):
    # Construct a query for Groq based on the user's diseases, BMI, and specific food
    query = f"Suggest food for someone with the following disease(s): {data.diseases}. Also, give alerts for food restrictions related to the disease(s) and a person with a BMI of {data.bmi}."
    
    if data.specific_food:
        query += f" Include recommendations for {data.specific_food} consumption. What should be the daily and weekly intake for this food?"

    # Get food recommendations from the service
    food_recommendations = get_food_recommendations(query)
    
    return food_recommendations
