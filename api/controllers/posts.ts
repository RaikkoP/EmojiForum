import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class PostController {
    static async createPost(req: Request, res: Response) {
        if (!req.body.message) {
            return res.status(400).json({ error: "No message detected"});
        };
        if (!req.body.emoji) {
            return res.status(400).json({ error: "No emoji deteccted"});
        };
        const newPost = await prisma.post.create({
            data: {
                message: req.body.message,
                emoji: req.body.emoji,
                userId: req.body.userId,
            },
        });
        return res.status(201).json(newPost);
    }
    static async getRecentPost(req: Request, res: Response) {
        const getPosts = await prisma.post.findMany({
            include: {
                user: true
            }
        });
        return res.json(getPosts);
    }
}

export default PostController;