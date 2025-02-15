import { useState } from 'react';
import { FaRobot, FaPlus, FaPaperPlane, FaMoon, FaSun, FaHistory } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatHistoryModal from './ChatHistoryModal';

// Gemini API key import
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showHistory, setShowHistory] = useState(false)

  const genAI = new GoogleGenerativeAI(API_KEY);

  const fetchGeminiResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(userMessage);
      const aiMessage = result.response.candidates[0].content.parts[0].text.replace(/\*/g, ''); // Remove * symbols
      setMessages((prevMessages) => [...prevMessages, { text: aiMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't respond. Please try again later.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);
    await fetchGeminiResponse(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <div
        className={`w-full max-w-4xl h-[600px] ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        } border border-gray-300 rounded-2xl shadow-xl flex flex-col overflow-hidden`}
      >
        {/* Header  */}
        <div className='bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg font-semibold p-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <FaRobot className='mr-2 text-2xl' /> Chatbot
          </div>
          <div className='flex items-center gap-3'>
            <button onClick={toggleDarkMode} title='Toggle Dark Mode' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40 transition'>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={() => setShowHistory(true)} title='Chat History' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40 transition'>
              <FaHistory />
            </button>

            <button onClick={startNewChat} title='New Chat' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40 transition'>
              <FaPlus />
            </button>
          </div>
        </div>
        {/* Message  */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {messages.length === 0 ? (
            <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Start the conversation...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 max-w-full w-fit rounded-2xl text-white shadow-md ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-600 text-white' : 'bg-gray-600 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && <p className='text-gray-500 '>Thinking...</p>}
        </div>

        <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t flex items-center gap-3`}>
          <div className='flex-1 relative'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className={`w-full border border-gray-300 p-4 pr-12 rounded-2xl focus:outline-none outline-none ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
              } shadow-sm`}
              placeholder='Send a message...'
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition ${
                !input.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 scale-110'
              }`}
              disabled={!input.trim() || loading}
            >
              <FaPaperPlane className='text-xl' />
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <ChatHistoryModal
          messages={messages}
          onClose={() => setShowHistory(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Chatbot;
