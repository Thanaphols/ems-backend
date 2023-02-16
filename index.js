const express = require('express')
const app = express();
const mysql =require('mysql2');
const connection = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');


const port = process.env.APP_PORT;// PORT 9753
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: false,
      parameterLimit: 50000,
    }),
    cors({
      origin: "*",
      method: ["GET", "POST", "PATCH", "DELETE"],
  })
    
  );


// Home page
app.get('/',(req,res)=>{
    res.send('Home page'); 
});


//Running Port
app.listen(port, ()=>{
    console.log('Welcome http://localhost:'+port);
});




const RouterAdduser = require('./routers/user/addUser');
const RouterInv = require('./routers/inv/inv');
const RouterAuth = require('./routers/auth/auth');
const RouterBorrow = require('./routers/borrow/borrow');
const RouterCategory = require('./routers/category/cate');
const RouterAdmin= require('./routers/admin/admin');
app.use("/api/auth", RouterAuth);
app.use('/api' ,[RouterAdduser,RouterInv,RouterAuth,RouterBorrow,RouterCategory,RouterAdmin] );



