import { useState } from 'react';
import axios from 'axios';

const FoodAlternatesPage = () => {
  const [foodList, setFoodList] = useState([]);
  const [alternatives, setAlternatives] = useState(null);

  const handleInputChange = (event) => {
    setFoodList(event.target.value.split(',').map(item => item.trim()));
  };

  const handleFetchAlternatives = async () => {
    try {
      const response = await axios.post('http://localhost:8000/food-alternatives', {
        food_list: foodList,
      });
      setAlternatives(response.data);
    } catch (error) {
      console.error('Error fetching food alternatives:', error);
    }
  };

  return (
    <div className="alternatives-container">
      <h2>Food Alternatives</h2>
      <input
        type="text"
        placeholder="Enter foods (comma separated)"
        onChange={handleInputChange}
      />
      <button onClick={handleFetchAlternatives}>Get Alternatives</button>

      {alternatives && (
        <div className="alternatives-result">
          <h3>Alternatives</h3>
          {alternatives.map((item, index) => (
            <div key={index}>
              <h4>{item.original_food.name}</h4>
              <ul>
                {item.alternatives.map((alt, idx) => (
                  <li key={idx}>
                    <strong>{alt.name}:</strong> {alt.amount_grams}g, Cost Ratio: {alt.cost_ratio}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodAlternatesPage;
