import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
        console.log(`MongoDB connected: ${db.connection.host}`)

    } catch (error) {
        console.error("ERROR AT connectDB:", error);
        process.exit(1);

    }
}

export default connectdb;