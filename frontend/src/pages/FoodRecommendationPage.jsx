import  { useState } from 'react';
import axios from 'axios';

const FoodRecommendationPage = () => {
  const [diseases, setDiseases] = useState('');
  const [bmi, setBmi] = useState('');
  const [specificFood, setSpecificFood] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post('http://localhost:8000/food-recommendation', {
        diseases,
        bmi,
        specific_food: specificFood,
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching food recommendations:', error);
    }
  };

  return (
    <div className="recommendation-container">
      <h2>Food Recommendations</h2>
      <input
        type="text"
        placeholder="Enter diseases (optional)"
        value={diseases}
        onChange={(e) => setDiseases(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter BMI"
        value={bmi}
        onChange={(e) => setBmi(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter specific food (optional)"
        value={specificFood}
        onChange={(e) => setSpecificFood(e.target.value)}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>

      {recommendations && (
        <div className="recommendations">
          <h3>Food Suggestions:</h3>
          <ul>
            {recommendations.food_suggestions.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodRecommendationPage;
