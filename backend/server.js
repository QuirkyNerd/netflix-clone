import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON requests and cookies
app.use(express.json());
app.use(cookieParser());

// CORS configuration supporting common frontend local dev origins with credentials
const allowedOrigins = [
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow during local development
        }
    },
    methods: ["GET", "POST"],
    credentials: true,
}));

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Welcome to the Netflix Clone API!");
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

