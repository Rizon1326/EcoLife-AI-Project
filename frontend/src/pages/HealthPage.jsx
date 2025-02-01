import { useState } from 'react';
import axios from 'axios';
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

  const sanitizeResponse = (text) => {
    if (typeof text === 'string') {
      let sanitizedText = text.replace(/[#-]+/g, '').trim();
      return sanitizedText;
    }
    return text;
  };

  const convertMarkdownToHTML = (markdownText) => {
    if (typeof markdownText === 'string') {
      return marked.parse(markdownText);
    } else if (Array.isArray(markdownText)) {
      return marked.parse(markdownText.join('\n'));
    }
    return '';
  };

  const handleSubmit = async () => {
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
      const response = await axios.post('http://localhost:8000/health/health_summary', healthData);

      const sanitizedData = {
        ...response.data,
        food_suggestions: sanitizeResponse(response.data.food_suggestions),
        recommendations: sanitizeResponse(response.data.recommendations),
        additional_notes: sanitizeResponse(response.data.additional_notes),
      };

      sanitizedData.food_suggestions = convertMarkdownToHTML(sanitizedData.food_suggestions);
      sanitizedData.recommendations = convertMarkdownToHTML(sanitizedData.recommendations);
      sanitizedData.additional_notes = convertMarkdownToHTML(sanitizedData.additional_notes);

      setHealthSummary(sanitizedData);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching health summary:', error.response || error);
      setErrorMessage('Failed to fetch health summary. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            Health Insights Dashboard
          </h2>
          <p className="text-lg text-gray-600">Track and monitor your health metrics</p>
        </div>
  
        {errorMessage && (
          <div className="mb-6 flex items-center p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}
  
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Age<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="Enter your age"
                  />
                </div>
  
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Height (cm)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="Enter your height"
                  />
                </div>
  
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Weight (kg)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="Enter your weight"
                  />
                </div>
              </div>
  
              {/* Right Column */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
  
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="e.g., 120/80"
                  />
                </div>
  
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Medical Conditions
                  </label>
                  <input
                    type="text"
                    value={diseases}
                    onChange={(e) => setDiseases(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="List any medical conditions"
                  />
                </div>
              </div>
            </div>
  
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Daily Activities<span className="text-red-500">*</span>
              </label>
              <textarea
                value={dailyActivities}
                onChange={(e) => setDailyActivities(e.target.value)}
                rows={3}
                className="block w-full px-4 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Describe your typical daily activities"
              />
            </div>
  
            {gender === 'female' && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    checked={pregnancy}
                    onChange={(e) => setPregnancy(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Currently Pregnant</label>
                </div>
  
                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    checked={period}
                    onChange={(e) => setPeriod(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Currently Menstruating</label>
                </div>
              </div>
            )}
  
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Generate Health Insights
              </button>
            </div>
          </div>
        </div>
  
        {healthSummary && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Health Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <p className="text-sm font-medium text-blue-800 mb-1">Body Mass Index (BMI)</p>
                  <p className="text-3xl font-bold text-blue-900">{healthSummary.bmi}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <p className="text-sm font-medium text-green-800 mb-1">Recommended Daily Calories</p>
                  <p className="text-3xl font-bold text-green-900">{healthSummary.recommended_calories}</p>
                </div>
              </div>
  
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Health Recommendations</h4>
                  <div 
                    dangerouslySetInnerHTML={{ __html: healthSummary.recommendations }}
                    className="prose max-w-none bg-gray-50 rounded-xl p-6"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPage;