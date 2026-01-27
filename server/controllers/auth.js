import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const normalizedEmail = (email || "").trim().toLowerCase();
        const existingUser = await User.findOne({ email: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists. Please log in." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email: normalizedEmail || email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        const isDuplicateKey =
            err.code === 11000 ||
            err.code === 11001 ||
            (err.message && String(err.message).includes("E11000")) ||
            (err.message && String(err.message).toLowerCase().includes("duplicate key")) ||
            (err.errmsg && String(err.errmsg).toLowerCase().includes("duplicate key"));
        if (isDuplicateKey) {
            return res.status(409).json({ message: "An account with this email already exists. Please log in." });
        }
        res.status(500).json({ message: err.message || "Registration failed. Please try again." });
    }
};

export const login = async(req, res) => {
    try{
        const{ email, password} = req.body;

        const normalizedEmail = (email || "").trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        delete user.password;
        
        res.status(200).json({ token, user });
           
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const buildResetUrl = (token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    return `${clientUrl}/reset-password?token=${token}`;
};

const sendResetEmail = async ({ to, resetUrl }) => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const info = await transporter.sendMail({
        from: `"SocialMedia" <${testAccount.user}>`,
        to,
        subject: "Password reset request",
        html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to set a new password:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>If you did not request this, you can ignore this email.</p>
        `,
    });

    return nodemailer.getTestMessageUrl(info);
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = (email || "").trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(200).json({
                message: "If an account exists for this email, a reset link has been sent.",
            });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        const resetUrl = buildResetUrl(rawToken);
        const previewUrl = await sendResetEmail({ to: user.email, resetUrl });

        return res.status(200).json({
            message: "If an account exists for this email, a reset link has been sent.",
            previewUrl,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to send reset email." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password are required." });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Reset token is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = "";
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successful. Please log in." });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to reset password." });
    }
};