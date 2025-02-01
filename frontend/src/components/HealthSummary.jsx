import React, { useState } from "react";
import { getHealthSummary } from "../services/api";

const HealthSummary = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [summary, setSummary] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await getHealthSummary({
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        gender,
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching health summary:", error);
    }
  };

  return (
    <div>
      <h2>Health Summary</h2>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Height (cm)"
      />
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight (kg)"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
      />
      <select onChange={(e) => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button onClick={handleSubmit}>Get Summary</button>

      {summary && (
        <div>
          <p>BMI: {summary.bmi}</p>
          <p>Recommended Calories: {summary.recommended_calories}</p>
          <p>Food Suggestions:</p>
          <ul>
            {summary.food_suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthSummary;
