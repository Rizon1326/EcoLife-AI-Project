import { useState } from 'react';
import axios from 'axios';
import { Mic, X, Loader2, MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  let recognition = null;

  // Initialize SpeechRecognition
  const initializeRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'bn-BD'; // Set to Bengali language
      recognition.continuous = false; // Stop after first result
      recognition.interimResults = false; // Don't show partial results
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };

  const startListening = () => {
    if (!recognition) {
      initializeRecognition(); // Initialize if not yet initialized
    }

    recognition.start();

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setMessage(speech);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { message });
      setResponse(res.data.reply);
      setMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Always visible */}
      <button
        onClick={() => setIsChatVisible(!isChatVisible)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg 
          transform transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      >
        {isChatVisible ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isChatVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl 
          transform transition-all duration-300 ease-in-out">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold text-xl text-gray-800">Chat with AI Assistant</h1>
            </div>

            {/* Messages Area */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
              {response && (
                <div className="bg-green-50 p-3 rounded-lg mb-2">
                  <p className="text-gray-800">{response}</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500
                    transition-colors duration-200"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>

              {/* Voice Input Controls */}
              <div className="flex justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700
                      bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Voice Input</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700
                      bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                    <span>Stop Voice Input</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
