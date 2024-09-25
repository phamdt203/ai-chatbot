import React from 'react';

function SpeechBubble({ response }) {
  return (
    <div className="speech-bubble">
      <p>{response}</p>
    </div>
  );
}

export default SpeechBubble;
