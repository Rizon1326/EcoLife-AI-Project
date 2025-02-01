import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Food Recommendations</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter diseases (optional)"
          value={diseases}
          onChange={(e) => setDiseases(e.target.value)}
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Enter BMI"
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter specific food (optional)"
          value={specificFood}
          onChange={(e) => setSpecificFood(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchRecommendations}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Recommendations
        </button>
      </div>
      
      {recommendations && (
        <div className="mt-8">
          {/* Display Food Suggestions */}
          {/* {recommendations.food_suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Food Suggestions:</h3>
              <ReactMarkdown>{recommendations.food_suggestions.join("\n")}</ReactMarkdown>
            </div>
          )} */}
          
          {/* Display Recommendations */}
          {recommendations.recommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Dietary Recommendations:</h3>
              <ReactMarkdown>{recommendations.recommendations.join("\n")}</ReactMarkdown>
            </div>
          )}
          
          {/* Display Food Alerts */}
          {recommendations.alerts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Food Restrictions:</h3>
              <ReactMarkdown>{recommendations.alerts.join("\n")}</ReactMarkdown>
            </div>
          )}
          
          {/* Display Additional Notes */}
          {/* {recommendations.additional_notes && (
            <div>
              <h3 className="text-xl font-bold mb-4">Additional Notes:</h3>
              <p>{recommendations.additional_notes}</p>
            </div>
          )} */}
          
          {/* Display Specific Food Intake Recommendations */}
          {Object.keys(recommendations.specific_food_intake).length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Specific Food Intake Recommendations:</h3>
              <ul className="list-disc list-inside">
                {Object.entries(recommendations.specific_food_intake).map(([food, intake], index) => (
                  <li key={index} className="mb-2">{food}: {intake}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodRecommendationPage;
