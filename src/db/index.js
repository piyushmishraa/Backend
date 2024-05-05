import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try {
        const connectionInstace= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected to mongodb database:${connectionInstace.connection.host}`);
        
    } catch (error) {
        
        console.log(error);
        process.exit(1)
    }
}

export default connectDB