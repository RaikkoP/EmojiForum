require("dotenv").config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
const app = express();
const store = new session.MemoryStore();
const prisma = new PrismaClient();

declare module 'express-session' {
    export interface SessionData {
        user: {[key:string]: any};
        authenticated: boolean
    }
}

// SETUP
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: bcrypt.genSaltSync(12),
    cookie: {
        maxAge: 30000,
    },
    saveUninitialized: false,
    store: store
}))

// get all users because we can
app.get('/users', async (req, res) => {
 const users = await prisma.user.findMany();
 res.json(users);
});

// get all the posts? FR?!
app.get('/posts', async (req , res) => {
    const posts = await prisma.post.findMany();
    res.json(posts)
});

// create new account
app.post('/user/create/', async (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.confirmPassword || !req.body.email) {
        return res.status(400).json({ error: "Please fill entire form!"})
    }
    if(!(req.body.password === req.body.confirmPassword)){
        return res.status(400).json({ error: "Passwords do not match!"});
    }
    const check_user = await prisma.user.findFirst({
        where: {
            OR: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        }
    });
    if(check_user?.username === req.body.username){
        return res.status(400).json({ error: "Username already in use!"});
    };
    if(check_user?.email === req.body.email){
        return res.status(400).json({ error: "Email already in use" });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const newUser = await prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }
    });
    return res.status(201).json(newUser);
});

// login to account
app.post('/user/login/', async(req, res) => {
    console.log(req.sessionID);
    console.log(store)
    if(!req.body.username || !req.body.password){
        return res.status(400).json({ error: 'Missing username or password'})
    }
    const find_user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        },
    });
    if(!find_user) {
        return res.status(400).json({error : 'Username does not exist.'})
    };
    const passwordCheck = await bcrypt.compare(req.body.password, find_user?.password);
    if (!passwordCheck) {
        return res.status(400).json({ error: 'Invalid Password.'})
    };
    req.session.authenticated = true;
    console.log(req.session.authenticated);
    req.session.user = {
        id: find_user.id,
        username: find_user.username,
        profilePicture: find_user.profilePic
    };
    return res.json(req.session)
});

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});