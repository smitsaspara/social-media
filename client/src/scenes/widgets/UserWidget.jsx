import {
    ManageAccountsOutlined,
    EditOutlined,
    EmailOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
} from "@mui/icons-material";

import { Box, Button, TextField, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLogin } from "state";
import API_BASE_URL from "utils/api";
  
const UserWidget = ({ userId, picturePath }) => {
    
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        location: "",
        occupation: "",
        twitterUrl: "",
        linkedinUrl: "",
    });
    const [formError, setFormError] = useState("");
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user?._id);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
  
    const getUser = async () => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []); 

    useEffect(() => {
        if (user) {
            setFormValues({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                location: user.location || "",
                occupation: user.occupation || "",
                twitterUrl: user.twitterUrl || "",
                linkedinUrl: user.linkedinUrl || "",
            });
        }
    }, [user]);

    if (!user) {
        return null;
    }
  
    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
        email,
        twitterUrl,
        linkedinUrl,
    } = user;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const validateSocialUrl = (value, allowedHosts) => {
            if (!value) return true;
            try {
                const url = new URL(value);
                if (!["http:", "https:"].includes(url.protocol)) return false;
                const host = url.hostname.replace(/^www\./, "").toLowerCase();
                return allowedHosts.includes(host);
            } catch (error) {
                return false;
            }
        };

        if (
            !validateSocialUrl(formValues.twitterUrl, ["twitter.com", "x.com"]) ||
            !validateSocialUrl(formValues.linkedinUrl, ["linkedin.com"])
        ) {
            setFormError(
                "Enter valid Twitter/X and LinkedIn profile URLs, or leave them empty."
            );
            return;
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                location: formValues.location,
                occupation: formValues.occupation,
                twitterUrl: formValues.twitterUrl,
                linkedinUrl: formValues.linkedinUrl,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsEditing(false);
            setFormError("");
            if (loggedInUserId === userId) {
                dispatch(setLogin({ user: data, token }));
            }
        } else {
            let message = "Update failed.";
            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (error) {
                // Ignore JSON parse errors
            }
            setFormError(message);
        }
    };
  
    return (
        <WidgetWrapper>
        
            {/* FIRST ROW */}
        
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${userId}`)}
            >
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                            }}
                        >
                            {firstName} {lastName}
                        </Typography>
                        <Typography color={medium}>{friends.length} friends</Typography>
                    </Box>
                </FlexBetween>
                {loggedInUserId === userId && (
                    <ManageAccountsOutlined
                        sx={{ cursor: "pointer" }}
                        onClick={() => setIsEditing((prev) => !prev)}
                    />
                )}
            </FlexBetween>
    
            <Divider />
    
            {/* SECOND ROW */}
            <Box p="1rem 0">
                {isEditing && loggedInUserId === userId ? (
                    <Box display="flex" flexDirection="column" gap="0.75rem">
                        <TextField
                            name="firstName"
                            label="First name"
                            value={formValues.firstName}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            name="lastName"
                            label="Last name"
                            value={formValues.lastName}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            name="location"
                            label="Location"
                            value={formValues.location}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            name="occupation"
                            label="Occupation"
                            value={formValues.occupation}
                            onChange={handleInputChange}
                            size="small"
                        />
                        {!!formError && (
                            <Typography color="error" fontSize="0.85rem">
                                {formError}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <>
                        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                            <Typography color={medium}>{location}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="1rem">
                            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                            <Typography color={medium}>{occupation}</Typography>
                        </Box>
                        {loggedInUserId === userId && email && (
                            <Box display="flex" alignItems="center" gap="1rem" mt="0.5rem">
                                <EmailOutlined fontSize="large" sx={{ color: main }} />
                                <Typography color={medium}>{email}</Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
    
            <Divider />
    
            {/* THIRD ROW */}
            <Box p="1rem 0">
                <FlexBetween mb="0.5rem">
                    <Typography color={medium}>Who's viewed your profile</Typography>
                    <Typography color={main} fontWeight="500">
                    {viewedProfile}
                    </Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography color={medium}>Impressions of your post</Typography>
                    <Typography color={main} fontWeight="500">
                    {impressions}
                    </Typography>
                </FlexBetween>
            </Box>
    
            <Divider />
    
            {/* FOURTH ROW */}
            <Box p="1rem 0">
                <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                    Social Profiles
                </Typography>
        
                <FlexBetween gap="1rem" mb="0.5rem">
                    <FlexBetween gap="1rem">
                    <img src="../assets/twitter.png" alt="twitter" />
                    <Box>
                        <Typography color={main} fontWeight="500">
                            Twitter
                        </Typography>
                        {isEditing && loggedInUserId === userId ? (
                            <TextField
                                name="twitterUrl"
                                label="Twitter URL"
                                value={formValues.twitterUrl}
                                onChange={handleInputChange}
                                size="small"
                            />
                        ) : (
                            <Typography color={medium}>
                                {twitterUrl ? (
                                    <a
                                        href={twitterUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {twitterUrl}
                                    </a>
                                ) : (
                                    "Not provided"
                                )}
                            </Typography>
                        )}
                    </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} />
                </FlexBetween>
        
                <FlexBetween gap="1rem">
                    <FlexBetween gap="1rem">
                    <img src="../assets/linkedin.png" alt="linkedin" />
                    <Box>
                        <Typography color={main} fontWeight="500">
                            Linkedin
                        </Typography>
                        {isEditing && loggedInUserId === userId ? (
                            <TextField
                                name="linkedinUrl"
                                label="LinkedIn URL"
                                value={formValues.linkedinUrl}
                                onChange={handleInputChange}
                                size="small"
                            />
                        ) : (
                            <Typography color={medium}>
                                {linkedinUrl ? (
                                    <a
                                        href={linkedinUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {linkedinUrl}
                                    </a>
                                ) : (
                                    "Not provided"
                                )}
                            </Typography>
                        )}
                    </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} />
                </FlexBetween>
            </Box>

            {isEditing && loggedInUserId === userId && (
                <FlexBetween>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setIsEditing(false);
                            setFormValues({
                                firstName: user.firstName || "",
                                lastName: user.lastName || "",
                                location: user.location || "",
                                occupation: user.occupation || "",
                                twitterUrl: user.twitterUrl || "",
                                linkedinUrl: user.linkedinUrl || "",
                            });
                            setFormError("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </FlexBetween>
            )}
        </WidgetWrapper>
    );
};
  
export default UserWidget;