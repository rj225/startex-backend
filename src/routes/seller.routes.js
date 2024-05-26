import express from 'express';
import { getBooks, uploadBooks, deleteBook, updateBook , addBook} from '../controllers/seller.controller.js';
import verifyToken from '../middleware/auth.middlewares.js';
import { upload } from '../middleware/multer.middlewares.js';

const router = express.Router();

router.use(verifyToken);

router.route('/upload_books')
    .post(upload.single('file'), uploadBooks);

router.route('/add-book').post(addBook);

router.route('/books')
    .get(getBooks);

router.route('/books/:bookId')
    .put(updateBook)
    .delete(deleteBook);


export default router;
