import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
// import zIndex from "@mui/material/styles/zIndex";


const Friend = ({ friendId, name, subtitle, userPicturePath , isPost , isOnline}) => {
  const REACT_APP_SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const onlineStatusStyle = {
    position: 'relative',
    bottom: '-1.2rem',
    right: '2rem',
    width: '14px',
    height: '14px',
    backgroundColor: isOnline ? 'lime' : 'grey',
    border: '2px solid white',
    borderRadius: '50%',
    zIndex : '99',
  };

  const patchFriend = async () => {
    const response = await fetch(
      `${REACT_APP_SERVER_BASE_URL}/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        {!isPost && <span style={onlineStatusStyle} ></span>}
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
            {/* {isOnline ? "Online" : "Offline"} */}
          </Typography>
        </Box>
      </FlexBetween>
      {friendId !== _id && <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>}
    </FlexBetween>
  );
};

export default Friend;
