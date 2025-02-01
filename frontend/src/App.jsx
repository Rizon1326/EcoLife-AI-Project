// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClassifyPage from './pages/ClassifyPage';
import HealthPage from './pages/HealthPage';
import FoodRecommendationPage from './pages/FoodRecommendationPage';
import FoodAlternatesPage from './pages/FoodAlternatesPage';
// import './styles/style.css';  // External CSS file

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/classify" element={<ClassifyPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/food-recommendation" element={<FoodRecommendationPage />} />
        <Route path="/food-alternatives" element={<FoodAlternatesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
