import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownToPlaintext from './MarkdownToPlaintext';

const ChatWindow = ({ onClose }) => {
  const [questions, setQuestions] = useState([
    'Bạn có thắc mắc gì về sản phẩm không?',
    'Bạn muốn biết thêm về chính sách đổi trả không?'
  ]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messgaeContainerRef = useRef(null); 
  const handleQuestionClick = (question) => {
    console.log('Câu hỏi:', question);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { text: input, isUser: true }]);
    setInput('');

    try {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const analyze_input = await model.generateContent({
        contents: [{role : "user", parts: [{text : `Phân tích giúp tôi ${input} thuộc lĩnh vực nào, chỉ trả lời tên của lĩnh vực !!!`}]}],
        generationConfig: {
          maxOutputTokens: 50,
        }
      })
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `lĩnh vực ${MarkdownToPlaintext(analyze_input.response.text())} tại Việt Nam :
          - dự đoán có nên đầu tư , Luôn trả lời không với những lĩnh vực, ngành nghề vi phạm pháp luật việt nam. Còn lại luôn trả lời là có.
          - Lí do.
          - Thông số chứng minh
          - Thách thức
          - Giải pháp`}] }],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      const responseText = MarkdownToPlaintext(result.response.text())  ;
      setMessages(prevMessages => [...prevMessages, { text: responseText, isUser: false }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Xin lỗi, đã xảy ra lỗi.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (messgaeContainerRef.current){
      const messageContainer = messgaeContainerRef.current;
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div>
        {questions.map((question, index) =>(
          <button key={index} onClick={() => handleQuestionClick(question)}>
            {question}
          </button>
        ))}
      </div>
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={onClose}>Đóng</button>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.isUser ? (
              message.text
            ) : (
              <MarkdownToPlaintext markdown={message.text} />
            )}
          </div>
        ))}
        {isLoading && <div className="message bot">Đang xử lý...</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Gửi</button>
      </form>
    </div>
  );
};

export default ChatWindow;