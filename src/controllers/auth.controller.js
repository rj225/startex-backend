import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {query} from '../db/index.js';
import { config } from 'dotenv';
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'

config();

const generateToken = (username, role) => {
    return jwt.sign({ username, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (![name, email, password, role].every(field => field?.trim())) {
            throw new apiError(400, "All fields are required");
        }

        const [existingUser] = await query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            throw new apiError(409, "User with email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const result = await query('INSERT INTO users (name, email, password, role ,token) VALUES (?, ?, ?, ? ,?)', [name, email, hashedPassword, role ,""]);

        const responseData = {
            message: "SignUp successfully",
            result: result 
        };

        res.status(201).json(new apiResponse(201, responseData, "User signed up successfully"));
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json(new apiResponse(500, {}, 'Internal server error'));
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new apiError(400, "Email and password are required");
        }

       
        const [user] = await query('SELECT * FROM users WHERE email = ?', [email]); 

        if (!user || user.length === 0) {
            throw new apiError(404, "User does not exist");
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if (!isPasswordValid) {
            throw new apiError(401, "Invalid email or password");
        }

        const token = generateToken(email, user[0].role); 

        
        await query('UPDATE users SET token = ? WHERE id = ?', [token, user[0].id]);

        const options = {
            httpOnly: true,
            secure: true, 
        };

        
        const { password: userPassword, ...loggedInUser } = user[0];

        return res
            .status(200)
            .cookie('token', token, options)
            .json(
                new apiResponse(
                    200,
                    {
                        user: loggedInUser,
                        token
                    },
                    "You logged in successfully"
                )
            );
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        
        await query('UPDATE users SET token = NULL WHERE id = ?', [req.user._id]);

       
        const options = {
            httpOnly: true,
            secure: true, 
        };

        return res
            .status(200)
            .clearCookie("token", options)
            .json(new apiResponse(200, {}, "User logged out"));
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

