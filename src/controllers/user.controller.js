import { query } from "../db/index.js";

const getAllBooks = async(req, res) => {

    const q1 = await query('SELECT * FROM books');
    console.log(q1[1]);
    if (q1[0]){
       res.status(200).send({message: "books fetched"})
    }
    else{
        res.status(400).send({message:"unauthorized user"})
    }
};

export default getAllBooks;