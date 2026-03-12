import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const baseUri = process.env.MONGO_URI.replace(/\/+$/, "");
        const maskedUri = baseUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
        
        process.stdout.write(`[DATABASE] Connecting to: ${maskedUri}/${DB_Name}\n`);
        
        const connectionInstance = await mongoose.connect(`${baseUri}/${DB_Name}`, {
            serverSelectionTimeoutMS: 5000, // Time out after 5s instead of buffering forever
        })
        
        process.stdout.write(`[DATABASE] MongoDB connected !! DB HOST: ${connectionInstance.connection.host}\n`);
        
        mongoose.connection.on('connected', () => {
            process.stdout.write(`[DATABASE EVENT] Mongoose connected to ${mongoose.connection.host}\n`);
        });

        mongoose.connection.on('error', (err) => {
            process.stderr.write(`[DATABASE EVENT ERROR] Mongoose connection error: ${err}\n`);
        });

        mongoose.connection.on('disconnected', () => {
            process.stderr.write(`[DATABASE EVENT warning] Mongoose disconnected from the database\n`);
        });

    } catch (error) {
        process.stderr.write("**************************************************\n");
        process.stderr.write("CRITICAL: MONGODB connection FAILED\n");
        process.stderr.write(`Error Details: ${error.message || error}\n`);
        process.stderr.write("**************************************************\n");
        // Don't exit here immediately if we want healthcheck to stay alive for debugging,
        // but traditionally we do exit. Let's keep exiting but ensure we see the error.
        process.exit(1);
    }
}

export default connectdb;