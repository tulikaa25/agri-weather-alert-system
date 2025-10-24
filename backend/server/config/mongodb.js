import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/agriweatherDB`); // New database name

    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};

export default connectDB;


