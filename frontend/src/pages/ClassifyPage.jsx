import  { useState } from 'react';
import axios from 'axios';

const ClassifyPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleClassify = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error during classification:', error);
    }
  };

  return (
    <div className="classify-container">
      <h2>Classify Waste</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleClassify}>Classify</button>

      {result && (
        <div className="classification-result">
          <h3>Classification Result</h3>
          <p><strong>Waste Type:</strong> {result.waste_type.type}</p>
          <p><strong>Description:</strong> {result.waste_type.description}</p>
          <p><strong>SDG Goal:</strong> {result.sdg_analysis.sdg_goal}</p>
          <p><strong>Guidance:</strong> {result.sdg_analysis.guidance}</p>
        </div>
      )}
    </div>
  );
};

export default ClassifyPage;
