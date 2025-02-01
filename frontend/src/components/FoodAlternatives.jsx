import React, { useState } from "react";
import { getFoodAlternatives } from "../services/api";

const FoodAlternatives = () => {
  const [foodList, setFoodList] = useState("");
  const [alternatives, setAlternatives] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await getFoodAlternatives(foodList.split(","));
      setAlternatives(response.data);
    } catch (error) {
      console.error("Error fetching food alternatives:", error);
    }
  };

  return (
    <div>
      <h2>Find Food Alternatives</h2>
      <input
        type="text"
        value={foodList}
        onChange={(e) => setFoodList(e.target.value)}
        placeholder="Enter comma-separated food items"
      />
      <button onClick={handleSubmit}>Get Alternatives</button>

      {alternatives.length > 0 && (
        <ul>
          {alternatives.map((item, index) => (
            <li key={index}>
              <strong>{item.original_food.name}</strong>: {item.original_food.key_nutrients.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodAlternatives;
