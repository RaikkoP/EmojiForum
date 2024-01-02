require("dotenv").config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
const app = express();
const prisma = new PrismaClient();

// SETUP
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    if(!req.body.password === req.body.confirmPassword){
        res.status(400).json({ error: "Passwords do not match!"});
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
        res.status(400).json({ error: "Username already in use!"});
    };
    if(check_user?.email === req.body.email){
        res.status(400).json({ error: "Email already in use" });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const newUser = await prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }
    });
    res.status(201).json(newUser);
});

// login to account
app.get('/user/login/:username/:password', async(req, res) => {
    const find_user = await prisma.user.findUnique({
        where: {
            username: req.params.username
        },
    });
    if(!find_user) {
        return res.status(400).json({error : 'Username does not exist.'})
    };
    const passwordCheck = await bcrypt.compare(req.params.password, find_user?.password);
    if (!passwordCheck) {
        return res.status(400).json({ error: 'Invalid Password.'})
    };
    res.status(201).json(find_user);
});

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});