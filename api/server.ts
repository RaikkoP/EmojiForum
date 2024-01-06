require("dotenv").config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// SETUP
const app = express();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// IMPORT ROUTERS
import router from './routes/routes';

// USE ROUTERS
app.use('/', router);
app.use('/images', express.static('images'));

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});