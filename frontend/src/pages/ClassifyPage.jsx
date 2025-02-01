import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from 'react-markdown';
import { Upload, ArrowUpCircle, CheckCircle, AlertCircle } from "lucide-react";

const ClassifyPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png, .jpg, .jpeg",
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const classifyWaste = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/classify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      setError("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Waste Classification
            </h1>
            <p className="text-xl text-gray-600">
              Upload an image to identify and classify waste materials
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`relative transition-all duration-300 ease-in-out
                ${isDragging || isDragActive ? 'scale-105 border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
                border-4 border-dashed rounded-xl p-12 text-center cursor-pointer
                hover:border-blue-400 hover:bg-blue-50 group`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-700">
                    {isDragging ? "Drop your image here" : "Drag & Drop your image"}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse (PNG, JPG, JPEG)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {file && (
              <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-6">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {file.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">
                        Ready for classification
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={classifyWaste}
                disabled={loading || !file}
                className={`px-8 py-4 rounded-xl font-semibold text-white
                  transform transition-all duration-300 
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}
                  ${!file ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <ArrowUpCircle className="w-5 h-5" />
                    <span>Classify Waste</span>
                  </span>
                )}
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-xl p-8 shadow-lg space-y-6 transition-all duration-300 animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-900">
                  Classification Result
                </h3>
                
                {/* Waste Type */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-xl font-semibold text-gray-900">
                      {result.waste_type.type}
                    </span>
                    
                  </div>
                  <p className="text-gray-700">{result.waste_type.description}</p>
                </div>

                {/* Analysis */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Detailed Analysis
                  </h4>
                  <div className="bg-gray-50 p-6 rounded-lg prose max-w-none">
                    <ReactMarkdown>{result.waste_type.waste_analysis}</ReactMarkdown>
                  </div>
                </div>

                {/* Classification Details */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Classification Details
                  </h4>
                  <div className="grid gap-4">
                    {result.details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-700">{detail.label}</span>
                        <span className="font-mono text-blue-600">
                          {(detail.score * 100).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;