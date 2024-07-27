import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js"; 


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('connected', connectionInstance.connection.host)
    } catch (error) {
        console.log("MONGODB connection error:", error)
        process.exit(1) // node process object
    }
}

export default connectDB