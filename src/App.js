import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SpeechBubble from './components/SpeechBubble';
import './App.css';

function App() {
  const [response, setResponse] = useState('');

  // Hàm handleApiResponse để nhận phản hồi từ InputForm và cập nhật response
  const handleApiResponse = (apiResponse) => {
    setResponse(apiResponse);
  };

  return (
    <div className="container">
      {/* Truyền handleApiResponse vào InputForm */}
      <InputForm
       handleApiResponse={handleApiResponse}
        setResponse={setResponse}/>
      {/* Hiển thị phản hồi từ AI */}
      {response && <SpeechBubble response={response} />}
    </div>
  );
}

export default App;
