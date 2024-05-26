import fs from 'fs';
import csv from 'csv-parser';
import {query} from '../db/index.js';
import multer from 'multer';
import apiResponse from '../utils/apiResponse.js';

const upload = multer({ dest: 'uploads/' });

export const uploadBooks = (req, res) => {
    console.log(req.role);
    if (req.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const seller_id = req.id;
    const filePath = req.file.path;

    const books = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', row => {
            books.push([row.title, row.author, row.price, seller_id]);
        })
        .on('end', () => {
            const query = 'INSERT INTO books (title, author, published_date, price, seller_id) VALUES ?';
            query(query, [books], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error uploading books.');
                }
                res.status(201).send('Books uploaded successfully.');
                fs.unlinkSync(filePath); // Delete the uploaded file after processing
            });
        });
};

export const getBooks = async(req, res) => {
    // console.log(req.user.role);
    if (req.user.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    // console.log("req.user.id",req.user.id);
    const q1 = await query('SELECT * FROM books WHERE seller_id = ?', [req.user.id]);
    console.log(q1[1]);
    if (q1[0]){
       res.status(200).send({message: "books fetched"})
    }
    else{
        res.status(400).send({message:"unauthorized user"})
    }
};

export const updateBook = (req, res) => {
    if (req.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const { bookId } = req.params;
    const { title, author, price } = req.body;

    const query = 'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ? AND seller_id = ?';
    query(query, [title, author, price, bookId, req.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error on the server.');
        }
        if (result.affectedRows === 0) return res.status(404).send('Book not found or unauthorized');
        res.status(200).send('Book updated successfully.');
    });
};

export const deleteBook = (req, res) => {
    if (req.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const { bookId } = req.params;

    const query = 'DELETE FROM books WHERE id = ? AND seller_id = ?';
    query(query, [bookId, req.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error on the server.');
        }
        if (result.affectedRows === 0) return res.status(404).send('Book not found or unauthorized');
        res.status(200).send('Book deleted successfully.');
    });
};
