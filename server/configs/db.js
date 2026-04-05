import mongoose from "mongoose";

const connectDB =async ()=>{
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI or MONGODB_URI is missing");
        }

        mongoose.connection.on('connected',()=>console.log("database connected"));
        await mongoose.connect(`${mongoUri}/greencart`)
    }catch(error){
        console.error(error.message);
    }
}

export default connectDB;