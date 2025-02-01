from pydantic import BaseModel
from typing import Optional

class FoodRecommendationRequest(BaseModel):
    diseases: Optional[str] = None  # A list of diseases or health conditions
    bmi: float  # The user's BMI
    specific_food: Optional[str] = None  # Optional specific food the user wants to consume
