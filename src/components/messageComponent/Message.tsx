import React from 'react';
import './Message.css';

interface MessageProps {
    text: string;
    isUserMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isUserMessage }) => {
    return (
        <div className={`message ${isUserMessage ? 'user-message' : 'bot-message'}`}>
            <div className="message-label">{isUserMessage ? 'Human' : 'Assistant'}</div>
            <div className={isUserMessage ? 'human-message-separator' : 'bot-message-separator'}></div>
            <div className="message-text">{text}</div>
        </div>
    );
};

export default Message;
