import React, { useState } from "react";
import { Oval, RotatingLines, TailSpin } from "react-loader-spinner";
import "./App.css";

const base_url = "https://smartai-demo.onrender.com"; //"https://refined-magnetic-buck.ngrok-free.app";
//const base_url = "https://refined-magnetic-buck.ngrok-free.app";
function App() {
  const [text, setText] = useState("");
  const [textQuery, setTextQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [chat, setChat] = useState([]);
  const [disableChat, setDisableChat] = useState(true);
  const [loader, setLoader] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextQueryChange = (e) => {
    setTextQuery(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async () => {
    setDisableChat(true);
    setLoader(true);
    const formData = new FormData();
    formData.append("prompt", text);
    files.forEach((document, index) => {
      formData.append(`documents`, document);
    });

    try {
      const response = await fetch(`${base_url}/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      //const data = await response.json();
      setDisableChat(false);
      setLoader(false);
      console.log("Response data:");
    } catch (error) {
      setDisableChat(true);
      setLoader(false);
      console.error("There was an error with the fetch operation:", error);
    }
  };

  const handleQuerySubmit = async () => {
    setDisableChat(true);
    setChat([...chat, { user: textQuery }]);
    console.log(textQuery);
    const formData = new FormData();
    formData.append("query", textQuery);
    setTextQuery("");
    try {
      const response = await fetch(`${base_url}/chat`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChat([...chat, { user: textQuery }, { rag: data.response }]); // Assuming the response from the server has a field 'response'
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    }
    setDisableChat(false);
  };

  return (
    <div className="App">
      {loader && (
        <div className="App-loader">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#171717"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      <div className="App-header">
        <div className="App-config">
          <h2>RAG API Testing</h2>
          <textarea
            className="App-textarea"
            rows={4}
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text here"
          />
          <hr />
          <div className="App-file-title">
            Select documents ( PDF format acceptable ):
          </div>
          {files.map((file, index) => (
            <div key={index} className="App-file-name">
              &#x2022; {file.name}
            </div>
          ))}
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />
          <hr />
          <div className="App-submit-container">
            <button className="App-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        <div className="App-chatbox">
          <div className="chat-container">
            {chat.map((message, index) => {
              if (message.user) {
                return (
                  <div key={index} className="chat-user">
                    <div className="chat">{message.user}</div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="chat-rag">
                    <div className="chat">{message.rag}</div>
                  </div>
                );
              }
            })}
          </div>

          <div className="chat-input-container">
            <textarea
              className="App-textarea"
              rows={4}
              value={textQuery}
              onChange={handleTextQueryChange}
              placeholder="Enter your text here"
            />
            <button
              disabled={disableChat}
              className="App-submit"
              onClick={handleQuerySubmit}
            >
              Send Query
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
