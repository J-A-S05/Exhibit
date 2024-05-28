import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useState , useEffect , useRef} from "react";
import {io} from 'socket.io-client'

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const {_id , picturePath} = useSelector((state) => state.user);
  const [onlineUsers , setOnlineUsers] = useState([]);

  const socket = useRef()
  useEffect(() => {
  socket.current = io("ws://localhost:8900")
} , [])

  useEffect(() => {
    socket.current.emit("addUser" , _id)
   
    socket.current.on("getUsers" , users => {
      // console.log("new users :")
      // console.log(users)
      setOnlineUsers(users);
    })
    
  } , [_id])

  return (
    <Box>
      <Navbar />

      {/* LEFT SIDE */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId = {_id} picturePath={picturePath}/>
        </Box>

        {/* MID */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget userId = {_id} picturePath={picturePath} />
          <PostsWidget UserId={_id} isProfile={false}/>
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <Box m="0 0" />
            <FriendListWidget userId={_id} onlineUsers = {onlineUsers}/>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
