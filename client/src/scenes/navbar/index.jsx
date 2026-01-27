import { useRef, useState } from "react";

import {
    Box, 
    Badge,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Menu,
    Divider,
    useTheme,
    useMediaQuery
} from "@mui/material";

import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu as MenuIcon,
    Close,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const Navbar = () => {

    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const activeRequestRef = useRef(null);

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    
    const fullName = `${user.firstName} ${user.lastName}`;

    const messageItems = [
        {
            id: "welcome",
            title: "Welcome",
            body: `Hi ${user.firstName}, welcome back!`,
            time: "Just now",
        },
        {
            id: "tips",
            title: "Search tip",
            body: "Search by first name to open profiles.",
            time: "1h ago",
        },
    ];

    const notificationItems = [
        {
            id: "friend",
            title: "New friend",
            body: "Someone sent you a friend request.",
            time: "2h ago",
        },
        {
            id: "post",
            title: "New post",
            body: "A friend shared a new post.",
            time: "1d ago",
        },
    ];

    const helpItems = [
        {
            id: "account",
            title: "Account help",
            body: "Update your profile from the profile page.",
        },
        {
            id: "support",
            title: "Support",
            body: "Email support at support@socialmedia.app",
        },
    ];

    const [messageAnchorEl, setMessageAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [helpAnchorEl, setHelpAnchorEl] = useState(null);

    const isMessageOpen = Boolean(messageAnchorEl);
    const isNotificationOpen = Boolean(notificationAnchorEl);
    const isHelpOpen = Boolean(helpAnchorEl);

    return(
        <>
        <FlexBetween padding="1rem 6%" backgroundColor={alt} >
            <FlexBetween gap="1.75rem">
                
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{
                        "&:hover": {
                        color: primaryLight,
                        cursor: "pointer",
                        },
                    }}
                >
                SocialMedia
                </Typography>

                {isNonMobileScreens && (
                <Box position="relative" width="350px">
                    <FlexBetween
                        backgroundColor={neutralLight}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase
                            placeholder="Search by first name..."
                            value={searchTerm}
                            onChange={async (event) => {
                                const nextValue = event.target.value;
                                setSearchTerm(nextValue);

                                if (activeRequestRef.current) {
                                    activeRequestRef.current.abort();
                                }

                                if (!nextValue.trim()) {
                                    setSearchResults([]);
                                    setIsSearching(false);
                                    setSearchError("");
                                    return;
                                }

                                const controller = new AbortController();
                                activeRequestRef.current = controller;
                                setIsSearching(true);
                                setSearchError("");

                                try {
                                    const response = await fetch(
                                        `http://localhost:3001/users/search/first-name?firstName=${encodeURIComponent(
                                            nextValue.trim()
                                        )}`,
                                        {
                                            method: "GET",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                            signal: controller.signal,
                                        }
                                    );

                                    if (!response.ok) {
                                        let message = "Search failed.";
                                        try {
                                            const errorData = await response.json();
                                            message = errorData.message || message;
                                        } catch (parseError) {
                                            // Ignore JSON parse errors
                                        }
                                        setSearchResults([]);
                                        setSearchError(message);
                                        return;
                                    }

                                    const data = await response.json();
                                    setSearchResults(data);
                                    setSearchError("");
                                } catch (error) {
                                    if (error.name !== "AbortError") {
                                        setSearchResults([]);
                                        setSearchError("Search failed.");
                                    }
                                } finally {
                                    setIsSearching(false);
                                }
                            }}
                        />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>

                    {!!searchTerm.trim() && (
                        <Box
                            position="absolute"
                            top="100%"
                            left="0"
                            right="0"
                            mt="0.5rem"
                            backgroundColor={alt}
                            borderRadius="0.5rem"
                            boxShadow={3}
                            zIndex="10"
                            maxHeight="300px"
                            overflow="auto"
                        >
                            {isSearching && (
                                <Box p="0.75rem 1rem">
                                    <Typography color={dark} fontSize="0.9rem">
                                        Searching...
                                    </Typography>
                                </Box>
                            )}

                            {!isSearching && searchError && (
                                <Box p="0.75rem 1rem">
                                    <Typography color={dark} fontSize="0.9rem">
                                        {searchError}
                                    </Typography>
                                </Box>
                            )}

                            {!isSearching && !searchError && searchResults.length === 0 && (
                                <Box p="0.75rem 1rem">
                                    <Typography color={dark} fontSize="0.9rem">
                                        No users found.
                                    </Typography>
                                </Box>
                            )}

                            {!isSearching &&
                                searchResults.map((result) => (
                                    <FlexBetween
                                        key={result._id}
                                        gap="0.75rem"
                                        padding="0.75rem 1rem"
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: neutralLight,
                                            },
                                        }}
                                        onMouseDown={() => {
                                            navigate(`/profile/${result._id}`);
                                            navigate(0);
                                            setSearchTerm("");
                                            setSearchResults([]);
                                        }}
                                    >
                                        <FlexBetween gap="0.75rem">
                                            <UserImage
                                                image={result.picturePath}
                                                size="40px"
                                            />
                                            <Box>
                                                <Typography
                                                    color={dark}
                                                    fontWeight="500"
                                                >
                                                    {result.firstName}{" "}
                                                    {result.lastName}
                                                </Typography>
                                                <Typography
                                                    color={dark}
                                                    fontSize="0.75rem"
                                                >
                                                    {result.occupation || "User"}
                                                </Typography>
                                            </Box>
                                        </FlexBetween>
                                    </FlexBetween>
                                ))}
                        </Box>
                    )}
                </Box>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
                <IconButton onClick={() => dispatch(setMode())}>
                    {
                        theme.palette.mode === "dark" ? (
                        <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                    )}
                </IconButton>
                
                <IconButton onClick={(event) => setMessageAnchorEl(event.currentTarget)}>
                    <Badge badgeContent={messageItems.length} color="primary">
                        <Message sx={{ fontSize: "25px" }} />
                    </Badge>
                </IconButton>
                <IconButton onClick={(event) => setNotificationAnchorEl(event.currentTarget)}>
                    <Badge badgeContent={notificationItems.length} color="primary">
                        <Notifications sx={{ fontSize: "25px" }} />
                    </Badge>
                </IconButton>
                <IconButton onClick={(event) => setHelpAnchorEl(event.currentTarget)}>
                    <Help sx={{ fontSize: "25px" }} />
                </IconButton>
                <FormControl variant="standard" value={fullName}>
                    <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutralLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1rem",
                            "& .MuiSvgIcon-root": {
                            pr: "0.25rem",
                            width: "3rem",
                            },
                            "& .MuiSelect-select:focus": {
                            backgroundColor: neutralLight,
                            },
                        }}
                        input={<InputBase />}
                        >
                        <MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                    </Select>
                </FormControl>
            </FlexBetween>
            ) : (
            <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <MenuIcon />
            </IconButton>
            )}

            {/* MOBILE NAV */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >

                {/* CLOSE ICON */}
                <Box display="flex" justifyContent="flex-end" p="1rem">
                    <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                    >
                    <Close />
                    </IconButton>
                </Box>

                {/* MENU ITEMS */}
                <FlexBetween
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="3rem"
                >
                    <IconButton
                        onClick={() => dispatch(setMode())}
                        sx={{ fontSize: "25px" }} 
                    >

                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightMode sx={{ color: dark, fontSize: "25px" }} />
                        )}
                    </IconButton>

                    <IconButton onClick={(event) => setMessageAnchorEl(event.currentTarget)}>
                        <Badge badgeContent={messageItems.length} color="primary">
                            <Message sx={{ fontSize: "25px" }} />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={(event) => setNotificationAnchorEl(event.currentTarget)}>
                        <Badge badgeContent={notificationItems.length} color="primary">
                            <Notifications sx={{ fontSize: "25px" }} />
                        </Badge>
                    </IconButton>
                    
                    <IconButton onClick={(event) => setHelpAnchorEl(event.currentTarget)}>
                        <Help sx={{ fontSize: "25px" }} />
                    </IconButton>
                    
                    <FormControl variant="standard" value={fullName}>
                    
                    <Select
                        value={fullName}
                        sx={{
                        backgroundColor: neutralLight,
                        width: "150px",
                        borderRadius: "0.25rem",
                        p: "0.25rem 1rem",
                        "& .MuiSvgIcon-root": {
                            pr: "0.25rem",
                            width: "3rem",
                        },
                        "& .MuiSelect-select:focus": {
                            backgroundColor: neutralLight,
                        },
                        }}
                        input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                        <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => dispatch(setLogout())}>
                        Log Out
                        </MenuItem>
                    </Select>
                    </FormControl>
                </FlexBetween>
                </Box>
            )}

        </FlexBetween>

        <Menu
            anchorEl={messageAnchorEl}
            open={isMessageOpen}
            onClose={() => setMessageAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box px="1rem" pt="0.75rem" pb="0.5rem">
                <Typography fontWeight="500">Messages</Typography>
            </Box>
            <Divider />
            {messageItems.map((item) => (
                <MenuItem key={item.id} onClick={() => setMessageAnchorEl(null)}>
                    <Box>
                        <Typography fontWeight="500">{item.title}</Typography>
                        <Typography fontSize="0.85rem">{item.body}</Typography>
                        <Typography fontSize="0.75rem" color="text.secondary">
                            {item.time}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>

        <Menu
            anchorEl={notificationAnchorEl}
            open={isNotificationOpen}
            onClose={() => setNotificationAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box px="1rem" pt="0.75rem" pb="0.5rem">
                <Typography fontWeight="500">Notifications</Typography>
            </Box>
            <Divider />
            {notificationItems.map((item) => (
                <MenuItem key={item.id} onClick={() => setNotificationAnchorEl(null)}>
                    <Box>
                        <Typography fontWeight="500">{item.title}</Typography>
                        <Typography fontSize="0.85rem">{item.body}</Typography>
                        <Typography fontSize="0.75rem" color="text.secondary">
                            {item.time}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>

        <Menu
            anchorEl={helpAnchorEl}
            open={isHelpOpen}
            onClose={() => setHelpAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box px="1rem" pt="0.75rem" pb="0.5rem">
                <Typography fontWeight="500">Help</Typography>
            </Box>
            <Divider />
            {helpItems.map((item) => (
                <MenuItem key={item.id} onClick={() => setHelpAnchorEl(null)}>
                    <Box>
                        <Typography fontWeight="500">{item.title}</Typography>
                        <Typography fontSize="0.85rem">{item.body}</Typography>
                    </Box>
                </MenuItem>
            ))}
        </Menu>
        </>
    );
};


export default Navbar;