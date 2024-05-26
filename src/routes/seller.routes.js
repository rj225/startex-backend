import express from 'express';
import { getBooks, uploadBooks, deleteBook, updateBook } from '../controllers/seller.controller.js';
import verifyToken from '../middleware/auth.middlewares.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(verifyToken);

router.route('/upload_books')
    .post(upload.single('file'), uploadBooks);

router.route('/books')
    .get(getBooks);

router.route('/books/:bookId')
    .put(updateBook)
    .delete(deleteBook);

export default router;
