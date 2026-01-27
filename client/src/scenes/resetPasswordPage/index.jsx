import { useState } from "react";
import { Alert, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

const resetSchema = yup.object().shape({
    password: yup.string().min(6, "min 6 characters").required("required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("required"),
});

const initialValues = {
    password: "",
    confirmPassword: "",
};

const ResetPasswordPage = () => {
    const { palette } = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const token = new URLSearchParams(location.search).get("token");

    const handleReset = async (values, onSubmitProps) => {
        setErrorMessage("");
        setInfoMessage("");

        if (!token) {
            setErrorMessage("Reset token is missing.");
            return;
        }

        const response = await fetch("http://localhost:3001/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password: values.password }),
        });

        const data = await response.json();
        onSubmitProps.resetForm();

        if (response.ok) {
            setInfoMessage(data.message || "Password reset successful. Please log in.");
        } else {
            setErrorMessage(data.message || "Unable to reset password.");
        }
    };

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    SocialMedia
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreens ? "40%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={palette.background.alt}
            >
                <Typography fontWeight="1000" variant="h4" sx={{ mb: "1.5rem" }} align="center">
                    Reset Password
                </Typography>

                {!token && (
                    <Alert severity="warning" sx={{ mb: "1.5rem" }}>
                        The reset link is missing or invalid. Please request a new one.
                    </Alert>
                )}

                <Formik
                    onSubmit={handleReset}
                    initialValues={initialValues}
                    validationSchema={resetSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="grid" gap="30px">
                                <TextField
                                    label="New Password"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={Boolean(touched.password) && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                />
                            </Box>

                            {errorMessage && (
                                <Alert severity="error" onClose={() => setErrorMessage("")} sx={{ mt: "1.5rem" }}>
                                    {errorMessage}
                                </Alert>
                            )}
                            {infoMessage && (
                                <Alert severity="info" onClose={() => setInfoMessage("")} sx={{ mt: "1.5rem" }}>
                                    {infoMessage}
                                </Alert>
                            )}

                            <Button
                                fullWidth
                                type="submit"
                                disabled={!token}
                                sx={{
                                    mt: "2rem",
                                    p: "1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                Reset Password
                            </Button>
                            <Typography
                                onClick={() => navigate("/")}
                                sx={{
                                    mt: "1rem",
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: palette.primary.light,
                                    },
                                }}
                                align="center"
                            >
                                Back to login
                            </Typography>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default ResetPasswordPage;
