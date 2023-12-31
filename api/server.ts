require("dotenv").config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';
const app = express();
const prisma = new PrismaClient();

app.use(cors());

//get all users because we can
app.get('/users', async (req, res) => {
 const users = await prisma.user.findMany();
 res.json(users);
});

//get all the posts? FR?!
app.get('/posts', async (req , res) => {
    const posts = await prisma.post.findMany();
    res.json(posts)
});

//create new account
app.post('/user/create/', async (req, res) => {
    const check_user = prisma.user.findFirst({
        where: {username: req.body.username}
    })
    if(!check_user){
        const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const newUser = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
        })
        res.status(201).json(newUser)
    } else {
        res.status(400).json(false)
    }
});

//login to account
app.get('/user/login', async(req, res) => {
    const find_user = prisma.user.findUnique({
        where: {
            username: req.body.username
        },
    });
    if(!find_user) {
        return res.status(400).json({error : 'Username does not exist.'})
    }
    const passwordCheck = await bcrypt.compare(req.body.password, JSON.stringify(prisma.user.findUnique({ where: {username: req.body.username }, select: {password:true}})));
    if (!passwordCheck) {
        return res.status(400).json({ error: 'Invalid Password.'})
    }
    res.json(find_user);
});

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});