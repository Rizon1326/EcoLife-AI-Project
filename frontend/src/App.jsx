import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClassifyPage from './pages/ClassifyPage';
import HealthPage from './pages/HealthPage';
import FoodRecommendationPage from './pages/FoodRecommendationPage';
import FoodAlternatesPage from './pages/FoodAlternatesPage';

// Layout wrapper component to handle consistent page structure
const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="pt-20"> {/* Add padding-top to account for fixed navbar */}
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <PageLayout>
                <HomePage />
              </PageLayout>
            } 
          />
          <Route 
            path="/classify" 
            element={
              <PageLayout>
                <ClassifyPage />
              </PageLayout>
            } 
          />
          <Route 
            path="/health" 
            element={
              <PageLayout>
                <HealthPage />
              </PageLayout>
            } 
          />
          <Route 
            path="/food-recommendation" 
            element={
              <PageLayout>
                <FoodRecommendationPage />
              </PageLayout>
            } 
          />
          <Route 
            path="/food-alternatives" 
            element={
              <PageLayout>
                <FoodAlternatesPage />
              </PageLayout>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;