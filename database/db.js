const mongoose = require('mongoose');
require('dotenv').config();

const connection = async ()=>{
    try{
        await mongoose.connect(process.env.db_url);
        console.log("db connected successfully..!")
    }catch(error){
        console.log('error in connecting DB' , error)
    }
}

module.exports = connection;