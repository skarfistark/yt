import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";  
import videoRoutes from "./routes/videos.js";  
import commentRoutes from "./routes/comments.js";  
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () =>{
    await mongoose.connect(process.env.MONGO).then(()=>{
        console.log("Connected to DB!");
    }).catch((err)=>{
        throw err;
    });
}

app.use(express.json())//allows the system to take up the json externally
app.use(cookieParser())//for creating cookies

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type');
    next();
});

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type']
}));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/comments",commentRoutes);

//middle ware to handle errors
app.use((err,req,res,next)=> {
    const status = err.status || 500;
    const message = err.message || "Something went wrong we will be back soon!";
    return res.status(status).json({
        success : false,
        status,
        message
    })
});

app.listen(8800,()=>{
    connect();
    console.log("Connected to Server!");
});