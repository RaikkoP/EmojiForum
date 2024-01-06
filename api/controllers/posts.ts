import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const regexPost = new RegExp("/^[a-zA-Z0-9_]{6,12}$/");

class PostController {
    static async createPost(req: Request, res: Response) {
        // CHECK IF USER HAS PROVIDED MESSAGE
        if (!req.body.message) {
            return res.status(400).json({ error: "No message detected" });
        };
        // CHECK IF USER HAS PROVIDED EMOJI
        if (!req.body.emoji) {
            return res.status(400).json({ error: "No emoji deteccted" });
        };
        // CHECK IF MESSAGE MATCH REGEX
        if (regexPost.test(req.body.message)) {
            return res.status(400).json({ error: "Password does not match regex, make sure password has 1 lowercase, 1 uppercase, 1 number, 1 symbol and is atleast 12 symbols" })
        }
        // CREATE NEW POST
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
        // GET ALL POSTS
        const getPosts = await prisma.post.findMany({
            include: {
                user: true
            }
        });
        return res.json(getPosts);
    }
}

export default PostController;