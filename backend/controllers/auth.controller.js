// Import necessary modules and models
import { User } from "../models/user.model.js"; // Ensure the path is correct
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// Signup function
export async function signup(req, res) {
    try {
        console.log("Signup request received:", req.body); // Log incoming request for debugging

        const { email, password, username } = req.body;

        // Check for missing fields
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check for existing user by email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image: "", // Set default image or handle accordingly
        });

        // Save the new user
        await newUser.save();
        console.log("New user created:", { email: newUser.email, username: newUser.username });

        // Respond with success, excluding password from the response
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "", // Exclude password from response for security
            },
        });
    } catch (error) {
        console.error("Error in signup controller:", error); // Log full error for debugging
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// Login function
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Log the email being searched for
        console.log("Attempting to find user with email:", email);

        // Find the user by email
        const user = await User.findOne({ email: email });

        // If no user is found, return invalid credentials
        if (!user) {
            console.log("No user found with the provided email.");
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Log user data (excluding password for security)
        console.log("User found:", { email: user.email, username: user.username });

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If the password does not match, return invalid credentials
        if (!isPasswordCorrect) {
            console.log("Password does not match for user:", user.email);
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with success, excluding password from the response
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "", // Exclude password from response for security
            },
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Logout function
export async function logout(req, res) {
    try {
        // Clear the JWT cookie
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Auth check function
export async function authCheck(req, res) {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error("Error in authCheck controller:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

