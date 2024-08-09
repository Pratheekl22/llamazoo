import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from '../messageComponent/Message';
import './Chat.css';
import { chatAPIRequest } from '../../services/chatService/Chat';

interface Message {
    text: string;
    isUserMessage: boolean;
}

const Chat = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleLLMMessage = async (message: string) => {
        await chatAPIRequest(message, setMessages);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLLMMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <Message key={index} text={message.text} isUserMessage={message.isUserMessage} />
                    ))}
                </div>
            </div>
            <div className="search-container">
                <TextField
                    className="search-bar"
                    fullWidth
                    id="outlined-basic"
                    label="Chat with a LLaMA"
                    variant="outlined"
                    onKeyDown={handleEnterPress}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleLLMMessage(inputValue)} edge="end">
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default Chat;
