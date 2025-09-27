import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// register user with our app
export const registerUser = async(req: Request, res: Response)=>{
    try{
        const{name, email, dateOfBirth, password} = req.body;
        // check everything in payload exists
        if(!name|| !email || !dateOfBirth || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            });
        }
        // user maybe already exists
        if(await User.findOne({email})){
            return res.status(401).json({
                success: false,
                message:"user already exists",
            });
        }
        //hashing pw using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // create user
        const newUser = new User({
            name,
            email,
            dateOfBirth,
            password: hashedPassword
        });
        
        // save user
        await newUser.save();

        // success

        return res.status(200).json({
            sucess: true,
            message: "user is registered successfully",
            newUser,
        });
        
    }
    catch(error){
        console.error("Error while registering user: ", error);
        return res.status(500).json({
            success: false,
            message:'User can not be registered, try again later',
        })
    }
}