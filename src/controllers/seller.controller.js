import fs from 'fs';
import csv from 'csv-parser';
import {query} from '../db/index.js';
import apiResponse from '../utils/apiResponse.js';

export const uploadBooks = (req, res) => {
    // console.log("req.user" , req.user.role);
    if (req.user.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const seller_id = req.user.id;
    const filePath = req.file.path;

    const books = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', row => {
            books.push([row.title, row.author, row.publishedDate,row.price, seller_id]);
        })
        .on('end', async() => {
            try{
            await query('INSERT INTO books (title, author, publishedDate, price, seller_id) VALUES ?', [books]);
            res.status(201).send('Books uploaded successfully.');
            fs.unlinkSync(filePath)
             // Delete the uploaded file after processing
            }
            catch(error){
                console.error(error);
                fs.unlinkSync(filePath)
            }
        });
};

export const addBook = async (req, res) => {
    if (req.user.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const { title, author, publishedDate, price } = req.body;
    const seller_id = req.user.id;

    const insertQuery = 'INSERT INTO books (title, author, publishedDate, price, seller_id) VALUES (?, ?, ?, ?, ?)';

    try {
        await query(insertQuery, [title, author, publishedDate, price, seller_id]);
        res.status(201).send('Book added successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding book.');
    }
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

export const updateBook = async(req, res) => {
    try{
        if (req.user.role !== 'seller') return res.status(403).send({ message: 'Unauthorized' });

    const { bookId } = req.params;
    const { title, author, price } = req.body;

    // const query = ;
    await query('UPDATE books SET title = ?, author = ?, price = ? WHERE id = ? AND seller_id = ?', [title, author, price, bookId, req.user.id]);
     res.status(200).send({message:"successfuly updated the book details"});
    }
    catch(error){
        console.log("error" , error);
    }
};

export const deleteBook = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'seller') {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        const { bookId } = req.params;

        // Execute the delete query asynchronously
        await query('DELETE FROM books WHERE id = ? AND seller_id = ?', [bookId, req.user.id]);

        // Respond with success message
        res.status(200).send('Book deleted successfully.');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Error deleting book.');
    }
};
