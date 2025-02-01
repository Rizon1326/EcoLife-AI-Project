import { useState } from 'react';
import axios from 'axios';
import './HealthPage.css';

const HealthPage = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodPressure, setBloodPressure] = useState('');
  const [diseases, setDiseases] = useState('');
  const [dailyActivities, setDailyActivities] = useState('');
  const [pregnancy, setPregnancy] = useState(false);
  const [period, setPeriod] = useState(false);
  const [healthSummary, setHealthSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const sanitizeResponse = (text) => {
    // Ensure the value is a string before applying the replace function
    if (typeof text === 'string') {
      // Remove unwanted special characters like # and -- 
      return text.replace(/[#-]+/g, '').trim();
    }
    return text;  // Return the original value if it's not a string
  };
  
  const handleSubmit = async () => {
    // Validate input
    if (!age || !height || !weight || !dailyActivities) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const healthData = {
      age,
      height,
      weight,
      gender,
      blood_pressure: bloodPressure || null,
      diseases: diseases || null,
      daily_activities: dailyActivities,
      pregnancy,
      period,
    };

    try {
      // Make POST request to the backend
      const response = await axios.post('http://localhost:8000/health/health_summary', healthData);

      // Sanitize the backend response
      const sanitizedData = {
        ...response.data,
        food_suggestions: sanitizeResponse(response.data.food_suggestions),
        recommendations: sanitizeResponse(response.data.recommendations),
        additional_notes: sanitizeResponse(response.data.additional_notes),
      };

      setHealthSummary(sanitizedData);
      setErrorMessage('');  // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching health summary:', error.response || error);
      setErrorMessage('Failed to fetch health summary. Please try again later.');
    }
  };

  return (
    <div className="health-container">
      <h2>Health Insights</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="health-inputs">
        <label>
          Age:
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label>
          Height (cm):
          <input
            type="number"
            placeholder="Enter your height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>

        <label>
          Weight (kg):
          <input
            type="number"
            placeholder="Enter your weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>

        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Blood Pressure (optional):
          <input
            type="text"
            placeholder="Enter your blood pressure"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
          />
        </label>

        <label>
          Diseases (optional):
          <input
            type="text"
            placeholder="Enter diseases if any"
            value={diseases}
            onChange={(e) => setDiseases(e.target.value)}
          />
        </label>

        <label>
          Daily Activities:
          <input
            type="text"
            placeholder="Describe your daily activities"
            value={dailyActivities}
            onChange={(e) => setDailyActivities(e.target.value)}
          />
        </label>

        {gender === 'female' && (
          <>
            <label>
              Pregnancy (only for females):
              <input
                type="checkbox"
                checked={pregnancy}
                onChange={(e) => setPregnancy(e.target.checked)}
              />
            </label>

            <label>
              Period (only for females):
              <input
                type="checkbox"
                checked={period}
                onChange={(e) => setPeriod(e.target.checked)}
              />
            </label>
          </>
        )}

        <button onClick={handleSubmit}>Get Health Summary</button>
      </div>

      {healthSummary && (
        <div className="health-summary">
          <h3>Health Summary</h3>
          <p><strong>BMI:</strong> {healthSummary.bmi}</p>
          <p><strong>Recommended Daily Calories:</strong> {healthSummary.recommended_calories}</p>

          <div>
            <strong>Food Suggestions:</strong>
            <div dangerouslySetInnerHTML={{ __html: healthSummary.food_suggestions }} />
          </div>

          <div>
            <strong>Recommendations:</strong>
            <div dangerouslySetInnerHTML={{ __html: healthSummary.recommendations }} />
          </div>

          <p><strong>Additional Notes:</strong> {healthSummary.additional_notes}</p>
        </div>
      )}
    </div>
  );
};

export default HealthPage;
