import React from "react";
import "./Input.css";

const Input = ({ typing,  sendMessage,emitTyping }) => {
  const [message, setMessage] = useState("");

  const ENDPOINT= 'https://project-chat-application.herokuapp.com/';
  socket = io(ENDPOINT);
  
  const emitTyping=()=>{
    socket.emit('sendTyping')
  }

  const setMsg = (e) => {
    setMessage(e.target.value);
    emitTyping();
  };
  

 function send(e){
   e.preventDefault();
   sendMessage(message);
 }

 function keyPress(e){
   if(e.key==="Enter"){
      sendMessage(message);
   }
 }

  return (
    <React.Fragment>
      <p>{typing}</p>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={setMsg}
          onKeyPress={keyPress}
        />
        <button className="sendButton" onClick={send}>
          Send
        </button>
      </form>
    </React.Fragment>
  );
};

export default Input;
