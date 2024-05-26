import { query } from "../db/index.js";

const getAllBooks = async(req, res) => {
    try{
    const q1 = await query('SELECT * FROM books');
    console.log(q1[1]);
    if (q1[0]){
       res.status(200).send(q1)
    }
    else{
        res.status(400).send({message:"unauthorized user"})
    }
}
catch(error){
    console.error(error);
}
};

export default getAllBooks;