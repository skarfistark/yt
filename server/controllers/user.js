import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req,res,next) => {

    // req.user.id comes from jwt (current user)
    if(req.params.id === req.user.id){
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set : req.body
            },{new : true});//new true is to send to res.json the new updated ones
            res.status(200).json(updatedUser);
        } catch {
            next(err);
        }
    }
    else{
        return next(createError(403,"You can update only your account"));
    }

}

export const deleteUser = async (req,res,next) => {

    if(req.params.id === req.user.id){
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted User Successfully!");
        } catch (err) {
            next(err);
        }
    }
    else{
        return next(createError(403,"You can delete only your account"));
    }
}


export const getUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(createError(404,"User not found!"));
        }
        res.status(200).json(
            user
        );
    } catch (err) {
        return next(err);
    }
}


export const subscribe = async (req,res,next) => {
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $push: {subscribedUsers : req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id,{
            $inc : { subscribers : 1},
        });

        res.status(200).json("Subscription Successfull");
    } catch (err) {
        next(err);
    }
}


export const unsubscribe = async (req,res,next) => {
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $pull: {subscribedUsers : req.params.id}
        });
        const user = await User.findById(req.params.id);
        if (user.subscribers >= 1) {
          user.subscribers -= 1;
          await user.save();
        }
        res.status(200).json("Subscription Cancelled");
    } catch (err) {
        next(err);
    }   
}


export const like = async (req,res,next) => {

    const id = req.user.id;
    const videoId = req.params.videoId;
    //addToSet + pull combo->handles duplicate likes by same user
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet : {likes : id},
            $pull : {dislikes : id}
        });
        res.status(200).json({
            success : true,
            message : "The Video has been liked"
        })
    } catch (err) {
        next(err);
    }

}


export const dislike = async (req,res,next) => {

    const id = req.user.id;
    const videoId = req.params.videoId;
    //addToSet ->handles duplicate likes by same user
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet : {dislikes : id},
            $pull : {likes : id}
        });
        res.status(200).json({
            success : true,
            message : "The Video has been disliked"
        })
    } catch (err) {
        next(err);
    }

}

