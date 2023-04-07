import { useState } from "react";
import { setPosts } from "state/index";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state/index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({call, postId, friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.user._id);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const OpendeleteModal = () => {
    setOpen(true);
  };

  const ClosedeleteModal = () => {
    setOpen(false);
  }

  const DeletePost = async () => {
    const response = await fetch(
      `http://${process.env.REACT_APP_IP}:3001/posts/${postId}`,
      {
        method:"DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const newposts= posts.filter(post => post._id !== postId);
    console.log(newposts)
    ClosedeleteModal();
    dispatch(setPosts({posts:newposts}));
    


  }

  const patchFriend = async () => {
    const response = await fetch(
      `http://${process.env.REACT_APP_IP}:3001/users/${_id}/${friendId}`,
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
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap="1rem">
        {call=="PostWidget" && loggedInUserId == friendId && (<IconButton aria-label="delete">
           <DeleteIcon onClick={OpendeleteModal} />

          <Dialog
            open={open}
            onClose={ClosedeleteModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Post?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete post? This action cannot be reverted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={ClosedeleteModal}>Cancel</Button>
              <Button onClick={DeletePost} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>


        </IconButton>)}
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>

      </FlexBetween>
    </FlexBetween>
  );
};

export default Friend;
