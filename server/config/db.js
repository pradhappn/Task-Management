const mongoose = require("mongoose");

async function connectDB() {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`MONGODB CONNECTED: ${connection.connection.host}`);

    } catch (error) {
        console.error("MONGODB CONNECTION FAILED:", error.message);
        process.exit(1);
    }

}
module.exports = connectDB;