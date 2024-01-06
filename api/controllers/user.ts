import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


class userController {
    static async changeProfilePicture(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded" });
        }
        const id = parseInt(req.body.id);
        const newProfilePic = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                profilePic: req.file?.filename
            }
        });
        console.log(newProfilePic);
        res.status(200).json(newProfilePic);
    }
}
export default userController;