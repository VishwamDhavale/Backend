import express from 'express';
import corn from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORN_ORIGIN,
    Credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

export default app;