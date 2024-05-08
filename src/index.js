import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})

connectDB()
.then(
  ()=>{
    app.listen(process.env.PORT||8000,()=>{
        `app is listening on ${process.env.PORT}`;
    })
  }
)
.catch(
  (err)=>{
    `mongoDB connection error ${err}`;
  }
)