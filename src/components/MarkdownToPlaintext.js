import React, { useState, useEffect } from "react";

function MarkdownToPlaintext({ markdown }) {
    const [plaintext, setPlaintext] = useState('');

    useEffect(() => {
        const convertWithRegex = () => {
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
            setPlaintext(text.trim()); // Cập nhật plaintext
        };

        convertWithRegex(); // Gọi hàm chuyển đổi
    }, [markdown]); // Chạy lại khi markdown thay đổi

    return <div>{plaintext}</div>; // Trả về plaintext trong div
}

export default MarkdownToPlaintext;