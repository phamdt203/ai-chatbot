import React from 'react';

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      Chat
    </button>
  );
};

export default ChatButton;