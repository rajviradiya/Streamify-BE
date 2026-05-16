const mongoose  = require("mongoose");

const mongoDbConnection = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection : ",conn.connection.host);
    }catch(err){
        console.log("DB Connection Error :", err);
        process.exit(1);
    }
}

module.exports = mongoDbConnection;
