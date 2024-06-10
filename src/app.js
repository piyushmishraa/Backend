import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app= express();
//cors wala error hatane ke liye 
//app.use(cors());   normally asie bhi likh sakte hain

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

//json se data aasakata hai uske liye

app.use(express.json(
    {
        limit:"16kb"
    }
));

//url ke form me data aaskta hai
app.use(express.urlencoded({extended:true,limit:"16kb"}));

// ye hamare public files batane ke liye
app.use(express.static("Public"));

//ye pata nhi but likh diya
app.use(cookieParser());

//importing routes

import userRouter from "./routes/user.route.js";

//abhi tak kisi route par jana hota tha to app.get krte the par qki hmlog express ke router ka user karre hain so app.use karenge

app.use("/api/v1/user",userRouter)


export default app;