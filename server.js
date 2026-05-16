const express = require('express');
const dotenv = require('dotenv');

const authROutes = require("./routes/auth.route");
const mongoDbConnection = require("./lib/mongo_db_connection");

// env configure
dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.get("/",(req,res)=>{
    res.send("This Is Chat Api ..")
    console.log("This Is Chat Api ..");
})


app.use("/api/auth",authROutes);


app.listen(PORT,()=>{
    console.log("sever is running on port :",PORT);
});
