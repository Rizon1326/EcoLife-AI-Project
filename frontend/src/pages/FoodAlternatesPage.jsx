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
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-600">Food Alternatives</h2>
      {/* Input for food list */}
      <div className="mb-8">
        <label htmlFor="foodInput" className="block text-lg font-medium mb-2 text-gray-700">
          Enter foods (comma separated)
        </label>
        <input
          id="foodInput"
          type="text"
          placeholder="e.g., apple, banana, chicken"
          onChange={handleInputChange}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      {/* Button to fetch alternatives */}
      <div className="text-center">
        <button
          onClick={handleFetchAlternatives}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
        >
          Get Alternatives
        </button>
      </div>
      {/* Displaying alternatives */}
      {alternatives && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-8 text-center text-indigo-600">Alternatives</h3>
          {alternatives.map((item, index) => (
            <div key={index} className="mb-12 bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-2xl font-semibold mb-4 text-indigo-600">{item.original_food.name}</h4>
              <ul className="space-y-4">
                {item.alternatives.map((alt, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                    <div className="w-1/2">
                      <strong>{alt.name}:</strong> {alt.amount_grams}g
                    </div>
                    <div className="text-sm text-gray-600 w-1/4">
                      <strong>Cost Ratio:</strong> {alt.cost_ratio}
                    </div>
                    <div className="text-sm text-gray-600 w-1/4">
                      <strong>Key Nutrients:</strong> {alt.key_matching_nutrients.join(', ')}
                    </div>
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