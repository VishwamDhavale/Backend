import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            process.stdout.write("[DATABASE EVENT] Using existing database connection\n");
            return;
        }

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        // Handle case where URI might have query params
        // Format: mongodb+srv://user:pass@host/dbname?params
        let connectionUrl = process.env.MONGO_URI;
        
        // Remove trailing slashes before parsing
        connectionUrl = connectionUrl.replace(/\/+$/, "");

        const hasQueryParams = connectionUrl.includes("?");
        const basePart = hasQueryParams ? connectionUrl.split("?")[0] : connectionUrl;
        const queryPart = hasQueryParams ? `?${connectionUrl.split("?")[1]}` : "";

        // If basePart already ends with a database name, we might be double-appending.
        // But for Atlas +srv, it usually ends at the host.
        const finalUrl = `${basePart.replace(/\/$/, "")}/${DB_Name}${queryPart}`;
        const maskedUri = finalUrl.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
        
        process.stdout.write(`[DATABASE] Connecting to: ${maskedUri}\n`);
        
        const connectionInstance = await mongoose.connect(finalUrl, {
            serverSelectionTimeoutMS: 5000,
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