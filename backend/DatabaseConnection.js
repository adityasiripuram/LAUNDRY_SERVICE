const mongoose = require("mongoose")
require('dotenv').config();

const DB =process.env.MONGOURI
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverSelectionTimeoutMS: 5000,
 }).then(()=>{
    console.log("connection established")
}).catch(err=>{
    console.log(err)

})

