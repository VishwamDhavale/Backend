import app from "./app.js";
import connectdb from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({
    path: "/.env"
});

app.on("error", (error) => {
    console.error("Express error:", error);
    process.exit(1);
});

connectdb()
    .then(() => {
        app.listen(process.env.PORT || 8001, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("DB connection failed", error);
        process.exit(1);
    });