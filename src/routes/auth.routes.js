import { Router } from 'express';
import { signup, login ,logout} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middlewares.js';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(verifyToken , logout);

export default router;
