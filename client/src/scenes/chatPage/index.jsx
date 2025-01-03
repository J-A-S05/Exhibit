import React, { useEffect, useRef, useState } from 'react'
import Navbar from 'scenes/navbar'
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import MessageWidget from 'scenes/widgets/MessageWidget';
import AllConvosWidget from 'scenes/widgets/AllConvosWidget';
import { setConvoId , setMessages} from 'state';
import {io} from 'socket.io-client'

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const ml = useSelector((state) => state.ml);
  const user = useSelector((state) => state.user)
  let _id = "";
  let picturePath = "";
  if(user){
    _id = user._id
    picturePath = user.picturePath
  }
  // const convoId = useSelector((state) => state.convoId);
  const token = useSelector((state) => state.token)
  const convoId = useSelector((state) => state.convoId);
  const messages = useSelector((state) => state.messages);
  const [allMessages , setAllMessages] = useState([]);
  const dispatch = useDispatch();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers , setOnlineUser] = useState([]);
  const sent = useSelector((state) => state.sent);
  
  const socket = useRef()
  useEffect(() => {
  socket.current = io("ws://localhost:8900")
  socket.current.on("getMessage", (data) => {
    setArrivalMessage({
      conversationId : convoId,
      sender: data.senderId,
      text: data.text,
    });
  });
} , [convoId])




  useEffect(() => {
    socket.current.emit("addUser" , _id)
   
    socket.current.on("getUsers" , users => {
      // console.log("new users :")
      // console.log(users)
      setOnlineUser(users);
    })
    
  } , [_id])


  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch(`http://localhost:8000/messages/${convoId}` , {
        method : "GET",
        headers : {Authorization : `Bearer ${token}`}
      });

      const data = await response.json();
      setMessages({messages : data});
      setAllMessages(data)
    }

    getMessages();
    // console.log(messages)
    // console.log(allMessages)

  } , [convoId , sent , arrivalMessage])

  return (
    <div>
      <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >


        {/* ALL CONVOS */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} height= "100px">
          <AllConvosWidget userId = {_id} onlineUsers = {onlineUsers}/>
        </Box>

        {/* PARTICULAR CONVO */}
        

        {convoId ? (
  <Box
    flexBasis={isNonMobileScreens ? "60%" : undefined}
    mt={isNonMobileScreens ? undefined : "2rem"}
    height="100px" 
  >
    {messages.length !== 0 && (
      <MessageWidget messages={allMessages} socket={socket} />
    )}
  </Box>
) : (
  <Typography>No conversation yet!</Typography>
)}
        

        
        {/* {isNonMobileScreens && ( */}
          {/* <Box flexBasis="26%"> */}
            {/* <AdvertWidget /> */}
            {/* <Box m="2rem 0" /> */}
            {/* <FriendListWidget userId={_id} /> */}
          {/* </Box> */}
        {/* )} */}

      </Box>
    </Box>


    </div>
  )
}

export default ChatPage














// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// const App = () => {
//   useEffect(() => {
//     // Emit login event when the component mounts
//     socket.emit('userLoggedIn', 'USER_ID'); // replace USER_ID with actual user ID

//     // Listen for status updates
//     socket.on('updateUserStatus', ({ userId, status }) => {
//       console.log(`${userId} is now ${status}`);
//       // Update the UI to reflect the user's status
//     });

//     // Cleanup on component unmount or when dependencies change
//     return () => {
//       socket.emit('userLoggedOut', 'USER_ID'); // replace USER_ID with actual user ID
//       socket.disconnect();
//     };
//   }, []); // Dependency array

//   return <div>Your social media app</div>;
// };

// export default App;

