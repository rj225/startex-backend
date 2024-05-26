import express from 'express';
import getAllBooks from '../controllers/user.controller.js';
import verifyToken from '../middleware/auth.middlewares.js';


const router = express.Router()

router.route("/getallbooks").get(verifyToken , getAllBooks);

export default router;