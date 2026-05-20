const mongoose = require( 'mongoose');

const connectDB = async () => {

    try{
        mongoose.set('strictQuery', false); //swithc this off
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database MONGO connected: ${conn.connection.host}`);
    }catch (error) {
        console.log(error);
    }
}
module.exports = connectDB;
