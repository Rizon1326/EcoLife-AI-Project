import { useState } from 'react';
import axios from 'axios';
import './HealthPage.css';
import { marked } from 'marked';

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

  // Function to sanitize unwanted characters
  const sanitizeResponse = (text) => {
    if (typeof text === 'string') {
      // Remove unwanted special characters like #, --, etc.
      let sanitizedText = text.replace(/[#-]+/g, '').trim();
      return sanitizedText;
    }
    return text;
  };

  // Function to convert markdown to HTML
  const convertMarkdownToHTML = (markdownText) => {
    // Ensure it's a string before passing to marked
    if (typeof markdownText === 'string') {
      return marked.parse(markdownText);
    } else if (Array.isArray(markdownText)) {
      // If it's an array, join it into a single string
      return marked.parse(markdownText.join('\n'));
    }
    return ''; // Return empty string if it's neither a string nor an array
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

      // Sanitize the backend response and convert markdown to HTML
      const sanitizedData = {
        ...response.data,
        food_suggestions: sanitizeResponse(response.data.food_suggestions),
        recommendations: sanitizeResponse(response.data.recommendations),
        additional_notes: sanitizeResponse(response.data.additional_notes),
      };

      // Convert Markdown to HTML if it's a valid string or array
      sanitizedData.food_suggestions = convertMarkdownToHTML(sanitizedData.food_suggestions);
      sanitizedData.recommendations = convertMarkdownToHTML(sanitizedData.recommendations);
      sanitizedData.additional_notes = convertMarkdownToHTML(sanitizedData.additional_notes);

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

          {/* <p><strong>Additional Notes:</strong> {healthSummary.additional_notes}</p> */}
        </div>
      )}
    </div>
  );
};

export default HealthPage;
