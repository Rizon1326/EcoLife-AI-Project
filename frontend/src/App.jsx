// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClassifyPage from './pages/ClassifyPage';
import HealthPage from './pages/HealthPage';
import FoodRecommendationPage from './pages/FoodRecommendationPage';
import FoodAlternatesPage from './pages/FoodAlternatesPage';

const App = () => {
  return (
    <Router>
      {/* <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"> */}
        <Navbar />
        {/* <main className="container mx-auto px-4 py-8 max-w-7xl"> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classify" element={<ClassifyPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/food-recommendation" element={<FoodRecommendationPage />} />
            <Route path="/food-alternatives" element={<FoodAlternatesPage />} />
          </Routes>
        {/* </main> */}
      {/* </div> */}
    </Router>
  );
};

export default App;