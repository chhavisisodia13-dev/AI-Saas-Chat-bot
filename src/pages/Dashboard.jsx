import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import ReactMarkdown from "react-markdown";

function Dashboard() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);



  // ALL CHATS
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: []
    }
  ]);


  // ACTIVE CHAT
  const [activeChatId, setActiveChatId] = useState(1);


  // GET ACTIVE CHAT
  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );


  // CREATE NEW CHAT
  const handleNewChat = () => {

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };

    setChats((prev) => [...prev, newChat]);

    setActiveChatId(newChat.id);

  };


  // ASK AI
  const handleAskAI = async () => {

    if (!prompt) return;

    const userMessage = {
      sender: "user",
      text: prompt
    };


    // UPDATE USER MESSAGE
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                userMessage
              ]
            }
          : chat
      )
    );


    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          prompt
        }
      );

      const aiMessage = {
        sender: "ai",
        text: res.data.reply
      };


      // UPDATE AI MESSAGE
     setChats((prevChats) =>
  prevChats.map((chat) =>
    chat.id === activeChatId
      ? {
          ...chat,

          title:
            chat.messages.length === 0
              ? prompt.slice(0, 20)
              : chat.title,

          messages: [
            ...chat.messages,
            aiMessage
          ]
        }
      : chat
  )
);

      setPrompt("");

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }

  };


  

    
  return (

    <div className="dashboard">


      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>AI SaaS</h2>

        <button
          className="new-chat-btn"
          onClick={handleNewChat}
        >
          + New Chat
        </button>


        <div className="chat-history">

          {chats.map((chat) => (

            <div
              key={chat.id}
              className={
                activeChatId === chat.id
                  ? "chat-item active"
                  : "chat-item"
              }

              onClick={() =>
                setActiveChatId(chat.id)
              }
            >

              {chat.title}

            </div>

          ))}

        </div>

      </div>



      {/* MAIN CHAT AREA */}
      <div className="chat-container">

        <h1 className="chat-header">
  AI Assistant 
</h1>




  
        <div className="chat-box">

          {activeChat?.messages?.map(
  (msg, index) => (

    <div
      key={index}
      className={
        msg.sender === "user"
          ? "user-message"
          : "ai-message"
      }
    >

      <div className="message-content">

        <ReactMarkdown>
          {msg.text}
        </ReactMarkdown>

      </div>

    </div>

  )
)}


         {loading && (

  <div className="ai-message">

    <div className="message-content">

      <div className="typing">

        <span></span>
        <span></span>
        <span></span>

      </div>

    </div>

  </div>

)}

        </div>



        {/* INPUT AREA */}
        <div className="input-area">

       <textarea
  rows="3"
  placeholder="Ask anything..."
  value={prompt}
  onChange={(e) =>
    setPrompt(e.target.value)
  }

  onKeyDown={(e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleAskAI();

    }

  }}
/>
          

          <button
  className="send-btn"
  onClick={handleAskAI}
>
  Send
</button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;