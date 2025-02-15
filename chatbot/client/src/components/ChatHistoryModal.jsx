const ChatHistoryModal = ({ messages, onClose, darkMode }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className={`p-5 rounded-lg shadow-lg w-3/4 max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-xl font-bold mb-4">Chat History</h2>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <p className="text-center">No chat history available.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`text-sm ${msg.sender === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                  <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                </div>
              ))
            )}
          </div>
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default ChatHistoryModal;
  