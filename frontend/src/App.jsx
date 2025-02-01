import React from "react";
import WasteClassifier from "./components/WasteClassifier";
import FoodAlternatives from "./components/FoodAlternatives";
import FoodRecommendation from "./components/FoodRecommendation";
import HealthSummary from "./components/HealthSummary";

const App = () => {
  return (
    <div>
      <h1>Waste Management and Health Dashboard</h1>
      <WasteClassifier />
      <FoodAlternatives />
      <FoodRecommendation />
      <HealthSummary />
    </div>
  );
};

export default App;
