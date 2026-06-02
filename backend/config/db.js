import mongoose from "mongoose";


const ConnectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL )
        console.log("Mongodb connect");

    } catch (error) {
        console.log("this is db error", error);


    }
}

export default ConnectDb;
