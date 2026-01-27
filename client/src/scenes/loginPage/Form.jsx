import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Alert,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

const forgotSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const initialValuesForgot = {
    email: "",
};

const Form = () => {

    const [pageType, setPageType] = useState("login");
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [prefilledEmail, setPrefilledEmail] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const isForgot = pageType === "forgot";

    const clearMessages = () => {
        setErrorMessage("");
        setInfoMessage("");
        setPrefilledEmail("");
        setPreviewUrl("");
    };

    const register = async (values, onSubmitProps) => {
        clearMessages();
        const formData = new FormData();

        for (let value in values) {
            formData.append(value, values[value]);
        }

        formData.append("picturePath", values.picture.name);

        const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
            method: "POST",
            body: formData,
        }
        );

        const data = await savedUserResponse.json();
        const responseText = String(data.message || data.error || data.errmsg || "");

        onSubmitProps.resetForm();

        if (savedUserResponse.ok && data._id) {
            setInfoMessage("Account created successfully. Please log in.");
            setPrefilledEmail("");
            setPageType("login");
        } else if (
            savedUserResponse.status === 409 ||
            (data.message && data.message.includes("already exists")) ||
            responseText.includes("E11000") ||
            responseText.toLowerCase().includes("duplicate key")
        ) {
            setInfoMessage("An account with this email already exists. Please log in.");
            setPrefilledEmail(values.email || "");
            setPageType("login");
        } else {
            setErrorMessage(data.message || data.error || "Registration failed. Please try again.");
        }
    };

    const login = async (values, onSubmitProps) => {
        clearMessages();

        const loggedInResponse = await fetch("http://localhost:3001/auth/login",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),   
        });

        const data = await loggedInResponse.json();

        onSubmitProps.resetForm();

        if (loggedInResponse.ok && data.token && data.user) {
            dispatch(
                setLogin({
                    user: data.user,
                    token: data.token,
                })
            );
            navigate("/home");
        } else {
            setErrorMessage(data.message || data.msg || "Invalid email or password.");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
        if (isForgot) await requestPasswordReset(values, onSubmitProps);
    };

    const requestPasswordReset = async (values, onSubmitProps) => {
        clearMessages();

        const response = await fetch("http://localhost:3001/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
        });

        const data = await response.json();
        onSubmitProps.resetForm();

        if (response.ok) {
            setInfoMessage(data.message || "If an account exists, a reset link has been sent.");
            if (data.previewUrl) {
                setPreviewUrl(data.previewUrl);
            }
        } else {
            setErrorMessage(data.message || "Unable to send reset email.");
        }
    };

    return (
        <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={
            isLogin
                ? { ...initialValuesLogin, email: prefilledEmail || initialValuesLogin.email }
                : isForgot
                ? { ...initialValuesForgot, email: prefilledEmail || initialValuesForgot.email }
                : initialValuesRegister
        }
        validationSchema={isLogin ? loginSchema : isForgot ? forgotSchema : registerSchema}
        >
            
        {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
        }) => (
            <form onSubmit={handleSubmit}>
            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
            >
                {isRegister && (
                <>
                    <TextField
                        label = "First Name"
                        onBlur = {handleBlur}
                        onChange = {handleChange}
                        value = {values.firstName}
                        name = "firstName"
                        error = {
                            Boolean(touched.firstName) && Boolean(errors.firstName)
                        }
                        helperText={touched.firstName && errors.firstName}
                        sx={{ gridColumn: "span 2" }}
                    />

                    <TextField
                        label = "Last Name"
                        onBlur= {handleBlur}
                        onChange = {handleChange}
                        value = {values.lastName}
                        name = "lastName"
                        error = {Boolean(touched.lastName) && Boolean(errors.lastName)}
                        helperText = {touched.lastName && errors.lastName}
                        sx={{ gridColumn: "span 2" }}
                    />

                    <TextField
                        label = "Location"
                        onBlur = {handleBlur}
                        onChange = {handleChange}
                        value = {values.location}
                        name = "location"
                        error = {Boolean(touched.location) && Boolean(errors.location)}
                        helperText = {touched.location && errors.location}
                        sx = {{ gridColumn: "span 4" }}
                    />

                    <TextField
                        label = "Occupation"
                        onBlur = {handleBlur}
                        onChange = {handleChange}
                        value = {values.occupation}
                        name = "occupation"
                        error= {
                            Boolean(touched.occupation) && Boolean(errors.occupation)
                        }
                        helperText = {touched.occupation && errors.occupation}
                        sx = {{ gridColumn: "span 4" }}
                    />

                    <Box
                        gridColumn = "span 4"
                        border = {`1px solid ${palette.neutral.medium}`}
                        borderRadius = "5px"
                        p = "1rem"
                        >

                        <Dropzone
                            acceptedFiles = ".jpg,.jpeg,.png"
                            multiple = {false}
                            onDrop = {(acceptedFiles) =>
                                setFieldValue("picture", acceptedFiles[0])
                            }
                        >
                            {({ getRootProps, getInputProps }) => (
                            <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                                <input {...getInputProps()} />
                                {!values.picture ? (
                                <p>Add Picture Here</p>
                                ) : (
                                <FlexBetween>
                                    <Typography>{values.picture.name}</Typography>
                                    <EditOutlinedIcon />
                                </FlexBetween>
                                )}
                            </Box>
                            )}
                        </Dropzone>
                    </Box>
                </>
                )}

                <TextField
                    label = "Email"
                    onBlur = {handleBlur}
                    onChange = {handleChange}
                    value = {values.email}
                    name = "email"
                    error = {Boolean(touched.email) && Boolean(errors.email)}
                    helperText = {touched.email && errors.email}
                    sx = {{ gridColumn: "span 4" }}
                />

                {!isForgot && (
                    <TextField
                        label = "Password"
                        type = "password"
                        onBlur = {handleBlur}
                        onChange = {handleChange}
                        value = {values.password}
                        name = "password"
                        error = {Boolean(touched.password) && Boolean(errors.password)}
                        helperText = {touched.password && errors.password}
                        sx = {{ gridColumn: "span 4" }}
                    />
                )}
            </Box>

            {/* ERROR / INFO MESSAGES */}
            {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage("")} sx={{ gridColumn: "span 4" }}>
                    {errorMessage}
                </Alert>
            )}
            {infoMessage && (
                <Alert severity="info" onClose={() => setInfoMessage("")} sx={{ gridColumn: "span 4" }}>
                    {infoMessage}
                </Alert>
            )}
            {previewUrl && (
                <Alert severity="success" onClose={() => setPreviewUrl("")} sx={{ gridColumn: "span 4" }}>
                    Preview email link:{" "}
                    <a href={previewUrl} target="_blank" rel="noreferrer">
                        {previewUrl}
                    </a>
                </Alert>
            )}

            {/* BUTTONS */}
            <Box>
                <Button fullWidth
                type="submit"
                sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                }}
                >
                {isLogin ? "LOGIN" : isForgot ? "SEND RESET LINK" : "REGISTER"}
                </Button>
                {isLogin && (
                    <Typography
                        onClick={() => {
                            setPageType("forgot");
                            resetForm();
                            clearMessages();
                        }}
                        sx={{
                            textDecoration: "underline",
                            color: palette.primary.main,
                            "&:hover": {
                                cursor: "pointer",
                                color: palette.primary.light,
                            },
                            mb: "1rem",
                        }}
                    >
                        Forgot your password?
                    </Typography>
                )}
                <Typography
                onClick={() => {
                    if (isForgot) {
                        setPageType("login");
                    } else {
                        setPageType(isLogin ? "register" : "login");
                    }
                    resetForm();
                    clearMessages();
                }}
                sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                    },
                }}
                >
                {isForgot
                    ? "Back to login."
                    : isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
            </Box>
            </form>
        )}
        </Formik>
    );
};

export default Form;