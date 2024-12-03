import React, { useState } from 'react';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Отправить сообщение на backend
    await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage })
    });

    setMessages([...messages, { text: newMessage, sender: 'user' }]);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Чат с AI-агентами</h1>

      <div id="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default ChatPage;
