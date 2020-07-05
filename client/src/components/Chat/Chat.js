import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [type,setType]=useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });

    return ()=>{//unmount method
      socket.emit('disconnect');
      socket.off();
    }
    
  }, [ENDPOINT, location.search]);


  
  useEffect(() => {//listen to incoming responses
    socket.on('message', message => {//message contains user data
      setMessages(messages => [ ...messages, message ]);
    });    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("typing",(data)=>{
      setType(data);
    })
}, []);



  const sendMessage = (message) => {//emit send msg
   if(message) {
      socket.emit('sendMessage', message);
    }
  }  
  const emitTyping=()=>{
    socket.emit('typing');
  }

 return (
  <div className="outerContainer">
    <div className="container">
      <InfoBar room={room} />
      <Messages messages={messages} name={name} />
      <Input typing={type} sendMessage={sendMessage} emitTyping={emitTyping} />
    </div>
      <TextContainer users={users}/>
  </div>
  );
}

export default Chat;

