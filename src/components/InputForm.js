import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownToPlainText from './MarkdownToPlaintext'; // Thêm import hàm này

function InputForm({ setResponse, handleApiResponse }) {  // Nhận handleApiResponse từ props
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("")
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const analyze_input = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `Phân tích giúp tôi ${input} thuộc lĩnh vực nào, chỉ trả lời tên của lĩnh vực !!!` }] }],
        generationConfig: {
          maxOutputTokens: 50,
        }
      });

      // Chuyển đổi markdown thành plain text trước khi trả về
      // const plainTextResult = MarkdownToPlainText(analyze_input.response.text() || "Không thể phân tích được câu hỏi của bạn.");

      const convertWithRegex = (markdown) => {
        
        let text = markdown || ''; // Đảm bảo rằng markdown không phải là undefined
        text = text.replace(/#{1,6}\s?/g, ''); // Xóa header
        text = text.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Xóa bold
        text = text.replace(/(\*|_)(.*?)\1/g, '$2'); // Xóa italic
        text = text.replace(/~~(.*?)~~/g, '$1'); // Xóa strikethrough
        text = text.replace(/`(.*?)`/g, '$1'); // Xóa inline code
        text = text.replace(/```[^`]+```/g, ''); // Xóa code block
        text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Xóa links
        text = text.replace(/^\s*[\*\-+]\s+/gm, ''); // Xóa bullet points
        text = text.replace(/^\s*\d+\.\s+/gm, ''); // Xóa numbered list
        text = text.trim(); // Cập nhật plaintext
        console.log("text",text)
        return text
    };

    console.log("analyze_input.response.text()",analyze_input.response.text())

    const result = analyze_input.response.text()
    console.log("result", result)
    handleApiResponse(result);
  

    const analyze_test = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `lĩnh vực ${result} tại Việt Nam :
      - dự đoán có nên đầu tư , Luôn trả lời không với những lĩnh vực, ngành nghề vi phạm pháp luật việt nam. Còn lại luôn trả lời là có.
      - Lí do.
      - Thông số chứng minh
      - Thách thức
      - Giải pháp` }] }],
      generationConfig: {
        maxOutputTokens: 50,
      }
    });


      const test = analyze_test.response.text()
      console.log("du doan linh vuc", test)
        const plainTextResult = convertWithRegex(test) || "Không thể phân tích được câu hỏi "
      handleApiResponse(plainTextResult);
      // Gọi handleApiResponse để truyền plainTextResult lên App.js
     
      
      // setResponse(plainTextResult)

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setResponse("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        className="input-box"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập yêu cầu của bạn"
      />
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : 'Gửi'}
      </button>
    </form>
  );
}

export default InputForm;
