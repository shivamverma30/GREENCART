import mongoose from "mongoose";
import { EMAIL_REGEX } from '../utils/validation.js';

const userSchema= new mongoose.Schema({
    name: {type:String ,required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_REGEX, 'Invalid email format'],
    },
    password: {type: String ,required:true},
    cartItems: {type: Object,default:{}},
},{minimize: false})


const User = mongoose.models.user || mongoose.model('user',
    userSchema)

export default User