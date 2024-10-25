import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

const corsOptions = {
    // origin: "https://top-pairs.netlify.app", // Replace with client origin
    origin:"http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  };

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// routes import
import userRouter from '../routes/user.routes.js'

app.use("/api/v1/users", userRouter)

export { app }