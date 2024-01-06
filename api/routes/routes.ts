import {Router} from 'express';
import { Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/auth';
import PostController from '../controllers/posts';
import multer from 'multer';
import path from 'path';
import userController from '../controllers/user';
const router = Router();

// MIDDLEWARE FOR PAYLOAD VERIFICATION
const validatePayload = (req: Request, res: Response , next: NextFunction) => {
    if(req.body){
        next();
    } else {
        res.status(400).send({ error: "No payload sent!"})
    }
}

// MIDDLEWARE FOR IMAGE UPLOADING
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../images');
        console.log('Saving file to', dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
 });

const upload = multer({storage: storage})


// CREATE NEW ACCOUNT
router.post('/user/create/', validatePayload, AuthController.createUser);

// LOGIN TO ACCOUNT
router.post('/user/login/', validatePayload, AuthController.loginUser);

// GET AUTHENTICATED USER
router.get('/user/get/', AuthController.getUser);

// USER LOGOUT
router.get ('/user/logout', AuthController.logOut);

// CREATE NEW POST
router.post('/post/create', validatePayload, PostController.createPost);

// UPDATE USER PROFILE
router.post('/user/profile/picture', upload.single('image'), userController.changeProfilePicture)

// GET ALL POSTS
router.get('/post/get', PostController.getRecentPost);



export default router;