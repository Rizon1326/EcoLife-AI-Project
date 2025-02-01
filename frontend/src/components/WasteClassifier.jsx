import React, { useState } from "react";
import { classifyWaste } from "../services/api";

const WasteClassifier = () => {
  const [file, setFile] = useState(null);
  const [classification, setClassification] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await classifyWaste(formData);
      setClassification(response.data);
    } catch (error) {
      console.error("Error classifying waste:", error);
    }
  };

  return (
    <div>
      <h2>Classify Waste</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Classify</button>

      {classification && (
        <div>
          <h3>Waste Type: {classification.waste_type}</h3>
          <p>{classification.details[0].label}</p>
        </div>
      )}
    </div>
  );
};

export default WasteClassifier;
