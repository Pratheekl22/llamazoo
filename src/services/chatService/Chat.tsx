import React from 'react';

export const chatAPIRequest = async (message: string, setMessages: React.Dispatch<React.SetStateAction<{ text: string; isUserMessage: boolean }[]>>) => {
    try {
        // Add the user's message to the chat
        setMessages(prevMessages => [...prevMessages, { text: message, isUserMessage: true }]);

        // Initialize the bot message placeholder
        const botMessage = { text: '', isUserMessage: false };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        const rawContext =  sessionStorage.getItem('context');
        const parsedContext = () => {
            if(rawContext) {
                return JSON.parse(rawContext);
            } else {
                return []
            }
        }

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.1',
                prompt: message,
                context: parsedContext()
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedText = '';

        // Read the streaming response
        while (reader && !done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                // Decode the chunk and process as JSON
                const text = decoder.decode(value, { stream: !done });
                const json = JSON.parse(text);

                if (json.response) {
                    accumulatedText += json.response;

                    // Update the last bot message with the accumulated text
                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        const lastMessageIndex = newMessages.length - 1;
                        if (lastMessageIndex >= 0 && !newMessages[lastMessageIndex].isUserMessage) {
                            newMessages[lastMessageIndex].text = accumulatedText;
                        }
                        return newMessages;
                    });
                }

                if (json.done) {
                    sessionStorage.setItem("context", JSON.stringify(json.context))
                    console.log(json.context)
                    break; // Exit loop if done
                }
            }
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};
