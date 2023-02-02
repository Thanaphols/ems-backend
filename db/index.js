require('dotenv').config();
const mysql =require('mysql2');

const connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_POST,
});

connection.connect((error)=>{
    if(error){
        console.log('database Error');
        return;
    }else{
        console.log('database Success')
    }
})

module.exports = connection;




