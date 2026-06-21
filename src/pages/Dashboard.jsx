import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";

function Dashboard() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] =
  useState(null);

const [selectedPDF, setSelectedPDF] =
  useState(null);

const imageInputRef = useRef();

const pdfInputRef = useRef();


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
  chat.title === "New Chat"
    ? prompt.slice(0, 25) + "..."
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
const handleImageUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  console.log(file);

  setSelectedImage(
    URL.createObjectURL(file)
  );

  const formData = new FormData();

  formData.append("image", file);

  formData.append(
    "prompt",
    "Explain this image"
  );

  try {

    setLoading(true);

    const res = await axios.post(

      "http://localhost:5000/api/upload/image",

      formData,

      {
        headers: {
          "Content-Type":
          "multipart/form-data"
        }
      }
    );

    console.log(res.data);

    const aiMessage = {

      sender: "ai",

      text: res.data.reply
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,

              messages: [
                ...chat.messages,
                aiMessage
              ]
            }
          : chat
      )
    );

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};


const handlePDFUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setSelectedPDF(file.name);

  const formData = new FormData();

  formData.append("pdf", file);

  formData.append(
    "question",
    "Summarize this PDF"
  );

  try {

    const res = await axios.post(

      "http://localhost:5000/api/upload/pdf",

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

    const aiMessage = {

      sender: "ai",

      text: res.data.reply
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,

              messages: [
                ...chat.messages,
                aiMessage
              ]
            }
          : chat
      )
    );

  } catch (error) {

    console.log(error);

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
  AI Assistant 🚀
</h1>
<div className="upload-section">

  {/* IMAGE UPLOAD */}

  <div className="upload-card">

    <h3>Upload Image 🖼️</h3>

    <button
      onClick={() =>
        imageInputRef.current.click()
      }
    >
      Choose Image
    </button>

    <input
      type="file"
      accept="image/*"
      ref={imageInputRef}
      style={{ display: "none" }}
      onChange={handleImageUpload}
    />

    {selectedImage && (

      <img
        src={selectedImage}
        alt="preview"
        className="preview-image"
      />

    )}

  </div>



  {/* PDF UPLOAD */}

  <div className="upload-card">

    <h3>Upload PDF 📄</h3>

    <button
      onClick={() =>
        pdfInputRef.current.click()
      }
    >
      Choose PDF
    </button>

    <input
      type="file"
      accept=".pdf"
      ref={pdfInputRef}
      style={{ display: "none" }}
      onChange={handlePDFUpload}
    />

    {selectedPDF && (

      <p className="pdf-name">

        {selectedPDF}

      </p>

    )}

  </div>

</div>
        <div className="chat-box">

          {activeChat.messages.map(
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