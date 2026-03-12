import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        const baseUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/+$/, "") : "";
        const maskedUri = baseUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
        console.log(`[DATABASE] Attempting to connect to: ${maskedUri}/${DB_Name}`);
        
        const connectionInstance = await mongoose.connect(`${baseUri}/${DB_Name}`)
        console.log(`[DATABASE] MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            console.error('[DATABASE ERROR] Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.error('[DATABASE warning] Mongoose disconnected from the database');
        });

    } catch (error) {
        console.error("**************************************************");
        console.error("CRITICAL: MONGODB connection FAILED");
        console.error("Error Details:", error);
        console.error("**************************************************");
        process.exit(1);
    }
}

export default connectdb;