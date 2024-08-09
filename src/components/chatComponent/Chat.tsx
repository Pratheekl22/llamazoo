import React, {useEffect, useRef, useState} from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from '../messageComponent/Message';
import './Chat.css';
import { chatAPIRequest } from "../../services/chatService/Chat.tsx";

interface Message {
    text: string;
    isUserMessage: boolean;
}

const Chat = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (isDivElement(chatContainer)) {
            // @ts-expect-error type error expected
            const shouldScroll = chatContainer.scrollHeight > chatContainer.clientHeight;
            if (shouldScroll) {
                // @ts-expect-error type error expected
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    function isDivElement(element: HTMLDivElement | null): element is HTMLDivElement {
        return element !== null;
    }

    const handleLLMMessage = async (message: string) => {
        await chatAPIRequest(message, setMessages);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Allow new line
                return;
            } else {
                // Prevent default behavior (e.g., adding a new line) and send the message
                event.preventDefault();
                handleLLMMessage(inputValue);
                setInputValue('');
            }
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-messages" ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <Message key={index} text={message.text} isUserMessage={message.isUserMessage}/>
                    ))}
                </div>
            </div>
            <div className="search-container">
                <TextField
                    className="search-bar"
                    fullWidth
                    multiline
                    minRows={1}
                    id="outlined-basic"
                    label="Chat with a LLaMA"
                    variant="outlined"
                    onKeyDown={handleKeyDown}
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
