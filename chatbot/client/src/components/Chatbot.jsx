import { useState } from 'react';
import { FaRobot, FaPlus } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

// import gemini api key from .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

 
  const genAI = new GoogleGenerativeAI(API_KEY);  // Interact with the gemini model API

  const fetchGeminiResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(userMessage);
      const aiMessage = result.response.candidates[0].content.parts[0].text;

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

  // start a new chat
  const startNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className='flex justify-center items-center min-h-screen '>
      <div className='w-full max-w-3xl h-[600px] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col'>
        <div className='bg-blue-500 text-white text-lg font-semibold p-4 rounded-t-lg flex items-center'>
          <FaRobot className='mr-2 text-xl' />
          Chatbot
        </div>

        <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50'>
          {messages.length === 0 ? (
            <p className='text-center text-gray-800'>Start the conversation ...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`p-3 max-w-xs rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-300 text-black self-start'}`}>
                {msg.text}
              </div>
            ))
          )}
          {loading && <p className='text-gray-500'>Thinking...</p>}
        </div>

        <div className='p-4 bg-white border-t flex items-center gap-2'>
        <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className='w-full border-none bg-gray-800 p-4 pl-5 pr-14 text-white placeholder-gray-400 focus:outline-none  focus:border-transparent shadow-sm transition disabled:opacity-50 rounded-tl-lg rounded-tr-lg'
              placeholder='Message Chatbot...'
              disabled={loading}
            />

          <button onClick={startNewChat} title='New Chat' className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition'>
            <FaPlus />
          </button>

          <button onClick={sendMessage} className='ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50' disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;