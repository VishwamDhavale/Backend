import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const baseUri = process.env.MONGO_URI.replace(/\/+$/, "");
        const maskedUri = baseUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
        
        // Use process.stdout.write to ensure logging even if console.log is overwritten
        process.stdout.write(`[DATABASE] Attempting to connect to: ${maskedUri}/${DB_Name}\n`);
        
        const connectionInstance = await mongoose.connect(`${baseUri}/${DB_Name}`)
        process.stdout.write(`[DATABASE] MongoDB connected !! DB HOST: ${connectionInstance.connection.host}\n`);
        
        mongoose.connection.on('error', (err) => {
            process.stderr.write(`[DATABASE ERROR] Mongoose connection error: ${err}\n`);
        });

        mongoose.connection.on('disconnected', () => {
            process.stderr.write(`[DATABASE warning] Mongoose disconnected from the database\n`);
        });

    } catch (error) {
        process.stderr.write("**************************************************\n");
        process.stderr.write("CRITICAL: MONGODB connection FAILED\n");
        process.stderr.write(`Error Details: ${error.message || error}\n`);
        process.stderr.write("**************************************************\n");
        process.exit(1);
    }
}

export default connectdb;