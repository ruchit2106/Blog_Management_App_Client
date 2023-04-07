import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  MoreHorizOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Button, Box, Divider, IconButton, InputBase, Typography, useTheme } from "@mui/material";

import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state/index";
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [showComments, ToggleComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const likeCount = Object.keys(likes).length;
  const fullName = `${user.firstName} ${user.lastName}`;
  const commentpicturePath = user.picturePath;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  

  const patchLike = async () => {
    // console.log("HEYO");
    const response = await fetch(`${process.env.REACT_APP_IP}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const displayComment = async () => {

    ToggleComments(!showComments)




    // dispatch(setFriends({ friends: data }));

  }
  const patchComment = async () => {

    const requestbody = {
      userId: loggedInUserId,
      commenttext: comment,
      fullname: fullName,
      picturePath: commentpicturePath,
    };
    console.log(JSON.stringify(requestbody))

    // ToggleComments(!showComments);
    const response = await fetch(`${process.env.REACT_APP_IP}/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestbody),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment("");
  };



  return (
    <WidgetWrapper m="2rem 0">
      
      <Friend
        call={"PostWidget"}
        postId={postId}
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${process.env.REACT_APP_IP}/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={displayComment}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length }</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* <IconButton>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>
      {showComments && (

        <Box mt="0.5rem">
          <InputBase
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            sx={{
              width: "100%",
              // backgroundColor: palette.neutral.light,
              borderRadius: "1rem",
              // padding: "1rem 2rem",
            }}
          />
          <Divider sx={{ margin: "0 0 0.75rem 0" }} />
          <FlexBetween>
            <FlexBetween gap="0.25rem">
            </FlexBetween>
            <Button
              disabled={!comment}
              onClick={patchComment}
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",

              }}
            >
              COMMENT
            </Button>


          </FlexBetween>

          {comments.map((comment, i) => (
            <Box>
              <FlexBetween mt="0.45rem">
                <FlexBetween gap="0.5rem">
                  <FlexBetween gap="0.3rem">
                    <UserImage
                      image={comment.picturePath}
                      size={"30px"} />

                  </FlexBetween>

                  <FlexBetween gap="0.3rem">
                    <Box
                      onClick={() => {
                        navigate(`/profile/${comment.commentBy}`);
                        navigate(0);
                      }}
                    >
                      <Typography
                        color={main}
                        variant="h5"
                        fontWeight="100"
                        sx={{
                          "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                          },
                        }}
                      >
                        {comment.fullname}
                      </Typography>
                    </Box>
                  </FlexBetween>



                </FlexBetween>


              </FlexBetween>
              <FlexBetween>
                <Typography sx={{ color: main, m: "0rem 0", pl: "2.5rem" }}>
                  {comment.comment}
                </Typography>
              </FlexBetween>
            </Box>
            // <FlexBetween>
            //     <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            //       {comment.comment}
            //     </Typography>
            // </FlexBetween>


            // <Box  sx={{ justifyContent: 'flex-start' }}>
            //   {/* <Divider /> */}


            //   <FlexBetween gap="1rem">
            //     <UserImage
            //       image={comment.picturePath}
            //       size={"40px"} />


            //     <Box
            //       onClick={() => {
            //         navigate(`/profile/${comment.commentBy}`);
            //         navigate(0);
            //       }}
            //     >
            // <Typography
            //   color={main}
            //   variant="h5"
            //   fontWeight="100"
            //   sx={{
            //     "&:hover": {
            //       color: palette.primary.light,
            //       cursor: "pointer",
            //     },
            //   }}
            // >
            //   {comment.fullname}
            // </Typography>

            //     </Box>
            //   </FlexBetween>

            //   {/* <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            //     {comment.fullname}
            //   </Typography> */}


            //   <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            //     {comment.comment}
            //   </Typography>
            // </Box>
          ))}

        </Box>

      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
