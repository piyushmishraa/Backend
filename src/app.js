import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json(
    {
        limit:"16kb"
    }
));

app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("Public"));
app.use(cookieParser());

//importing routes

import userRouter from "./routes/user.route.js";

//abhi tak kisi route par jana hota tha to app.get krte the par qki hmlog express ke router ka user karre hain so app.use karenge

app.use("/api/v1/user",userRouter)


export default app;