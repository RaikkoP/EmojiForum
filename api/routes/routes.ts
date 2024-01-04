import {Router} from 'express';
import { Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/auth';
import jwt from 'jsonwebtoken';
const router = Router();

// MIDDLEWARE FOR PAYLOAD VERIFICATION
const validatePayload = (req: Request, res: Response , next: NextFunction) => {
    if(req.body){
        next();
    } else {
        res.status(400).send({ error: "No payload sent!"})
    }
}


// CREATE NEW ACCOUNT
router.post('/user/create/', validatePayload, AuthController.createUser);

// LOGIN TO ACCOUNT
router.post('/user/login/', validatePayload, AuthController.loginUser);

// GET AUTHENTICATED USER
router.get('/user/get/', AuthController.getUser);



export default router;