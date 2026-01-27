import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";

import { Box, Button, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend.jsx";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
  
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
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const loggedInUser = useSelector((state) => state.user);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const [commentText, setCommentText] = useState("");
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
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

    const addComment = async () => {
        const trimmed = commentText.trim();
        if (!trimmed) return;

        const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: loggedInUserId,
                name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
                text: trimmed,
            }),
        });

        if (response.ok) {
            const updatedPost = await response.json();
            dispatch(setPost({ post: updatedPost }));
            setCommentText("");
        }
    };
  
    return (
        <WidgetWrapper m="2rem 0">
            <Friend
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
                src={`http://localhost:3001/assets/${picturePath}`}
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
                    <IconButton onClick={() => setIsComments(!isComments)}>
                        <ChatBubbleOutlineOutlined />
                    </IconButton>
                    <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
    
                <IconButton>
                    <ShareOutlined />
                </IconButton>

            </FlexBetween>
            
            {isComments && (
            <Box mt="0.5rem">
                <FlexBetween gap="0.5rem" mb="0.75rem">
                    <TextField
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        size="small"
                        fullWidth
                    />
                    <Button variant="contained" onClick={addComment}>
                        Post
                    </Button>
                </FlexBetween>
                {comments.map((comment, i) => {
                    const formattedComment = comment.includes(":")
                        ? comment
                        : `User: ${comment}`;
                    return (
                        <Box key={`${name}-${i}`}>
                            <Divider />
                            <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                                {formattedComment}
                            </Typography>
                        </Box>
                    );
                })}
                <Divider />
            </Box>
            )}
        </WidgetWrapper>
    );
  };
  
  export default PostWidget;