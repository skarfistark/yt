import Video from "../models/Video.js";
import { createError } from "../error.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json({
            success: true,
            message: "Video Added!",
            savedVideo
        })
    } catch (err) {
        next(err);
    }
}

export const updateVideo = async (req, res, next) => {

    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found!"));
        }

        if (req.user.id !== video.userId) {
            return next(createError(403, "You cant update other videos!"));
        }

        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Video Updated!",
            updatedVideo
        });

    } catch (err) {
        next(err);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {

        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found!"));
        }

        if (req.user.id !== video.userId) {
            return next(createError(403, "You cant delete other videos!"));
        }

        const deletedVideo = await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Video Deleted!",
            deletedVideo
        })
    } catch (err) {
        next(err);
    }
}

export const getVideo = async (req, res, next) => {
    try {

        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found!"));
        }

        res.status(200).json(
            video
        )
    } catch (err) {
        next(err);
    }
}


export const addView = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found!"));
        }

        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "The Views is increased!"
        });

    } catch (err) {
        next(err);
    }
}


export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size : 3 } }]);//fetches that no. random videos

        res.status(200).json({
            success: true,
            videos
        });

    } catch (err) {
        next(err);
    }
}

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });//most viewed videos

        res.status(200).json({
            success: true,
            videos
        });

    } catch (err) {
        next(err);
    }
}

export const sub = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(createError(404, "User not found!"));
        }

        const subscribedChannels = user.subscribedUsers;

        //finds out all videos of the user subscribed channels
        const list = await Promise.all(
            subscribedChannels.map(channelId => {
                return Video.find({ userId: channelId });//all videos of a userId
            })
        );

        res.status(200).json({
            success: true,
            message: "Videos are fetched!",
            videos : list.flat().sort((a, b) => b.createdAt - a.createdAt) // gives the recent videos uploaded by subs of user
        });

    } catch (err) {
        next(err);
    }
}


export const getByTag = async (req, res, next) => {

    const tags = req.query.tags.split(",");

    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);//finds the videos with atleast one user req tags in the videos
        res.status(200).json({
            videos
        })
    } catch (err) {
        next(err);
    }
}

export const search = async (req, res, next) => {

    const query = req.query.q;
    try {
        const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40);//finds the videos with atleast one user req tags in the videos
        res.status(200).json({
            videos
        })
    } catch (err) {
        next(err);
    }
}