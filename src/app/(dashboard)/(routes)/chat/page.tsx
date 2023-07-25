// Chat with AI page
'use client';

// Global imports
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

// Local imports
import { Heading } from '@/components/Heading';
import  './style.page.css' // the only external style for messages

// Message type
type Message = {
  type: 'bot' | 'user' | 'system';
  message: string;
};



const ChatPage = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatLog, setChatLog] = useState<Message[]>([
    {
      type: 'bot',
      message: 'Hello, How can I help you?',
    },
  ]);

  // Handle Submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // add inputValue to chatLog
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: 'user', message: inputValue },
    ]);
    console.log("Input value", inputValue, typeof inputValue);
    

    // send the message via sendMessage function
    sendMessage({ type: 'user', message: inputValue });
    // clear the input field
    setInputValue('');
  };

  // Send message function
  async function sendMessage(message: Message): Promise<void> {
    // taking a message object, but need to get the data and send it to backend
    const { message: messageText } = message;
    try {
      // call the backend
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      // get the response and parse into object
      const data = await res.json();

      // add the response to chatLog
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: 'bot', message: data.message },
      ]);



    } catch (error) {
      console.log('Error when sending to backend', error);
    }
  }

  return (
    <div className='w-full'>
      <Heading
        title='Chat with AI'
        description='OpenAI GPT-4 Have a converstaion with the AI.'
        icon={MessageSquare}
        iconColor='text-red-500'
        bgColor='bg-red-500/10'
      />

      <div>
        {/* Chat Messages */}
        <div className='container flex flex-col mx-auto mt-10 h-[500px] w-[500px] border border-blue-500 rounded-xl overflow-y-auto '>
          {chatLog.map((message, index) => (
            <div
              className={`flex p-2  border-2 rounded-md
        ${
          message.type === 'bot'
            ? 'bg-blue-200 self-start'
            : 'bg-white self-end'
        }`}
              key={index}
            >
              <pre className='chat-message' >{message.message}</pre>
            </div>
          ))}
        </div>


        {/* Input and send */}
        <div className='container flex flex-row justify-center mb-10 p-5
        '>
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              className='h-full p-2 rounded-md'
              required
              type='text'
              placeholder='Type your message...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white p-2 rounded-md'
              type='submit'
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
