import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    },
    img : {
        type : String,
        required : true,
        default : "https://imgs.search.brave.com/tf0p183qxOYzqSHtYXbhrhXeHbaZ8rVFBx1GPb6rmHw/rs:fit:759:225:1/g:ce/aHR0cHM6Ly90c2Uz/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5i/UEJDZ3ZwOU4wU1Vi/VllKbkJnMklRSGFF/byZwaWQ9QXBp"
    },
    subscribers : {
        type : Number,
        default : 0
    },
    subscribedUsers : {
        type : [String]
    },
    fromGoogle : {
        type : Boolean,
        default : false,
    }
},{timestamps : true});

export default mongoose.model("User",UserSchema);