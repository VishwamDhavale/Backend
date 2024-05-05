import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORN_ORIGIN,
    Credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;