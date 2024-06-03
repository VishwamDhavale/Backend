import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORN_ORIGIN,
    Credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(cookieParser())

// Routes import
import userRoute from './routes/user.routes.js';


// Routes declaration
app.use('/api/v1/users', userRoute);
//http://localhost:8000/api/v1/users/register

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;