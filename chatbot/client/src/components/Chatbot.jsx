import { useState } from 'react';
import { FaRobot, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-3xl h-[600px] bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col overflow-hidden'>
        <div className='bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg font-semibold p-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <FaRobot className='mr-2 text-2xl' /> Chatbot
          </div>
          <button onClick={startNewChat} title='New Chat' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40 transition'>
            <FaPlus />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
          {messages.length === 0 ? (
            <p className='text-center text-gray-500'>Start the conversation...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> 
                <div className={`p-3 max-w-full w-fit rounded-2xl text-white shadow-md ${msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600 text-black'}`}> 
                  {msg.text} 
                </div>
              </div>
            ))
          )}
          {loading && <p className='text-gray-500 '>Thinking...</p>}
        </div>

        <div className='p-4 bg-white border-t flex items-center gap-3'>
        <div className='flex-1 relative'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className='w-full border border-gray-300 p-4 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm'
              placeholder='Send a message...'
              disabled={loading}
            />
            <button onClick={sendMessage} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition disabled:opacity-50' disabled={loading}>
              <FaPaperPlane className='text-xl' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
