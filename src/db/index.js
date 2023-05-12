import mongoose from "mongoose";

export const conextionDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
};

