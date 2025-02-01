import React, { useState } from "react";
import { getFoodRecommendation } from "../services/api";

const FoodRecommendation = () => {
  const [diseases, setDiseases] = useState("");
  const [bmi, setBmi] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await getFoodRecommendation({
        diseases,
        bmi: parseFloat(bmi),
      });
      setRecommendations(response.data.food_suggestions);
    } catch (error) {
      console.error("Error fetching food recommendations:", error);
    }
  };

  return (
    <div>
      <h2>Food Recommendation</h2>
      <input
        type="text"
        value={diseases}
        onChange={(e) => setDiseases(e.target.value)}
        placeholder="Enter diseases"
      />
      <input
        type="number"
        value={bmi}
        onChange={(e) => setBmi(e.target.value)}
        placeholder="Enter BMI"
      />
      <button onClick={handleSubmit}>Get Recommendations</button>

      {recommendations.length > 0 && (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodRecommendation;
