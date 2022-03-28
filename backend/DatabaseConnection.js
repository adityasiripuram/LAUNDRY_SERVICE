const mongoose = require("mongoose")
const DB ="mongodb+srv://Admin:qwerty7@laundry-servicedb.iwqpz.mongodb.net/laundry-service?retryWrites=true&w=majority"
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
 }).then(()=>{
    console.log("connection established")
}).catch(err=>{
    console.log(err)})

