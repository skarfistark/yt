import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {

    try {
        //...req.body means take every property of the body
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(200).send("User have been created");

    } catch (err) {
        next(err);
        // next(createError(400,"Duplicate Name or Email!"));-->custom error detailer
    }
}

export const signin = async (req, res, next) => {

    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            return next(createError(404, "User Not found"));
        }
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) {
            return next(createError(400, "Wrong Credentials"));
        }
        //creating token
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        //sending token to user
        const {password , ...otherDetails} = user._doc;//triming out the password to not send in res.json
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({otherDetails,token});
    } catch (err) {
        next(err);
        // next(createError(400,"Duplicate Name or Email!"));-->custom error detailer
    }
}


export const googleAuth = async(req,res,next) => {

    try{
        const user = await User.findOne({email : req.body.email});
        if(user){//signin
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json({otherDetails : user._doc,token});
        }
        else{//signup
            const newUser = new User({ ...req.body,fromGoogle : true});
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json({otherDetails : savedUser._doc,token});

        }
    } catch(err){
        next(err);
    }
}
