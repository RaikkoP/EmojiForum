import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// CREATE JWT SECRET TOKEN
const secretJWT = bcrypt.genSaltSync(11);
// REGEX
const regexUsername = new RegExp("/^[a-zA-Z0-9_]{6,18}$/");
const regexPassword = new RegExp("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_,\?\%&\*\@\!]).{12,24}$/");

class AuthController {
    static async createUser(req: Request, res: Response) {
        // CHECK IF WE HALL INFO NEEDED FROM PAYLOAD
        if (!req.body.username || !req.body.password || !req.body.confirmPassword || !req.body.email) {
            return res.status(400).json({ error: "Please fill entire form!" })
        }
        // CHECK IF PASSWORDS MATCH
        if (!(req.body.password === req.body.confirmPassword)) {
            return res.status(400).json({ error: "Passwords do not match!" });
        }
        // CHECK IF PASSWORDS MATCH REGEX
        if (regexPassword.test(req.body.password)) {
            return res.status(400).json({ error: "Password does not match regex, make sure password has 1 lowercase, 1 uppercase, 1 number, 1 symbol and is atleast 12 symbols" })
        }
        // CHECK IF USERNAME MATCH REGEX
        if (regexUsername.test(req.body.username)) {
            return res.status(400).json({ error: "Username does match regex" })
        }
        // FIND IF THERE IS A USER ALREADY MADE WITH THE USERNAME OR EMAIL
        const check_user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        });
        // CHECK IF USERNAME IN USE
        if (check_user?.username === req.body.username) {
            return res.status(400).json({ error: "Username already in use!" });
        };
        // CHECK IF EMAIL IN USE
        if (check_user?.email === req.body.email) {
            return res.status(400).json({ error: "Email already in use" });
        }
        // HASHPASSWORD AND CREATE NEW ACCOUNT
        const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const newUser = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
        });
        return res.status(201).json(newUser);
    }

    static async loginUser(req: Request, res: Response) {
        // CHECK THAT WE HAVE BOTH USERNAME AND PASSWORD FROM PAYLOAD
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Missing username or password' })
        }
        // CHECK IF PASSWORDS MATCH REGEX
        if (regexPassword.test(req.body.password)) {
            return res.status(400).json({ error: "Password does not match regex, make sure password has 1 lowercase, 1 uppercase, 1 number, 1 symbol and is atleast 12 symbols" })
        }
        // CHECK IF USERNAME MATCH REGEX
        if (regexUsername.test(req.body.username)) {
            return res.status(400).json({ error: "Username does match regex" })
        }
        // FIND THE USER BY USERNAME
        const find_user = await prisma.user.findUnique({
            where: {
                username: req.body.username
            },
        });
        // IF USER DOES NOT EXIST
        if (!find_user) {
            return res.status(400).json({ error: 'Username does not exist.' })
        };
        // OTHERWISE COMPARE PASSWORD WITH SAVED PASSWORD
        const passwordCheck = await bcrypt.compare(req.body.password, find_user?.password);
        if (!passwordCheck) {
            return res.status(400).json({ error: 'Invalid Password.' })
        };
        // DECONSTRUCT FIND_USER TO REMOVE PASSWORD
        const { password, ...data } = find_user;
        // SIGN JWT AND SEND DATA TO FRONTEND
        const token = jwt.sign(data, secretJWT, { expiresIn: "5m" });
        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: 300000,
            sameSite: 'lax',
        }).send({ message: "Login succesful" });
    }

    static async getUser(req: Request, res: Response) {
        // ATTEMPT TO ACCESS GIVEN COOKIE FOR USERINFO
        try {
            const cookie = req.cookies['token'];
            const claim = jwt.verify(cookie, secretJWT) as JwtPayload;
            if (!claim) {
                return res.status(401).send({
                    message: 'Unauthenticated'
                });
            }
            // GATHER USERINFO IF COOKIE IS FOUND
            const user = await prisma.user.findFirst({
                where: {
                    id: claim.id
                }
            });
            if (!user) {
                return res.status(404).send({
                    message: 'User not found'
                })
            }
            const { password, ...data } = user;
            res.send(data);
        } catch (err) {
            return res.status(401).send({
                message: 'Unauthenticated'
            });
        }
    }

    // LOGOUT FUNCTION
    static async logOut(req: Request, res: Response) {
        res.cookie('token', '', { maxAge: 0 });
        res.send({
            message: 'Logged out'
        })
    }
}

export default AuthController;