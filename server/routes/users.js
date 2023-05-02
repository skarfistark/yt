import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, updateUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();


//update user
router.put("/:id",verifyToken,updateUser);

//delete user
router.delete("/:id",verifyToken,deleteUser);

//get user
router.get("/find/:id",getUser);

//subscribe a user //id->channel id
router.post("/sub/:id",verifyToken,subscribe);

//unsubscribe a user
router.post("/unsub/:id",verifyToken,unsubscribe);

//like a video
router.post("/like/:videoId",verifyToken,like);

//dislike a video
router.post("/dislike/:videoId",verifyToken,dislike);


export default router;