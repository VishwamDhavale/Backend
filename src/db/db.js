import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        const baseUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/+$/, "") : "";
        const maskedUri = baseUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
        console.log(`Connecting to MongoDB: ${maskedUri}/${DB_Name}`);
        
        const connectionInstance = await mongoose.connect(`${baseUri}/${DB_Name}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected');
        });

    } catch (error) {
        console.error("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectdb;