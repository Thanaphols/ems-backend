const express = require('express');
const router = express.Router();
const db = require('../../db');
//เรียกข้อมูล User ทั้งหมด
router.get('/users',(req,res)=>{
    db.query(`SELECT * FROM user `,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send(
                data,
                {  
                total:data.length }
                )
        }
    })
})

//เรียกข้อมูล User จาก ID
router.get('/user/:id',(req,res)=>{
    const id = req.params.id;
    db.query(`SELECT * FROM user  WHERE u_id = ${id}`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send(
                data,
                {  
                total:data.length }
                )
        }
    })
})

//Add user
router.post('/users/addUser/', async (req,res)=>{
    const email = req.body.email;
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    if(!email || !username ||  !lastname || !password){
        return res.status(400).send({ message: "Please enter All data" })
    }else{

        db.query(`SELECT * FROM user WHERE email = '${email}' `,(err,results)=>{
            if(results.length){
                return res.status(400).send({message: 'Already have Email' });
            }else{
                db.query(
                    "INSERT INTO user (email,username,firstname,lastname,password) VALUES(?,?,?, ?, ?) ",
                    [email,username,firstname,lastname,password],
                    (err,results)=>{
                        if(err){
                            console.log("Can't insert user",err);
                            return res.status(400);
                        }
                        return res.status(201).send({
                            message: 'Registered!',
                          })
                    }
                )
            }
        })

       
    }
} );

// User  Update user Where id
router.patch('/users/upUser/:u_id', async (req,res) => {
    
    const { email,username,firstname,lastname,password } = req.body;
    const id = req.params.u_id;

    if(!password){
        try {
            db.query(`Update user SET email = '${email}',username = '${username}',firstname = '${firstname}',lastname = '${lastname}' WHERE u_id = '${id}' `,
            (err)=>{
                if(err){
                    console.log("Cann't Update Data",err);                
                    return res.status(400).send();
                }
                    return res.status(201).json({message: "Update user Success "});
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    }else{
        try {
            db.query(`Update user SET email = '${email}',username = '${username}',firstname = '${firstname}',lastname = '${lastname}',password= '${password}' WHERE u_id = '${id}' `,
            (err)=>{
                if(err){
                    console.log("Cann't Update Data",err);                
                    return res.status(400).send();
                }
                    return res.status(201).json({message: "Update user Success "});
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    }

   
})

// Admin  Update user Where id
router.patch('/users/adupUser/:u_id', async (req,res) => {
    
    const { email,username,firstname,lastname,password,u_stat } = req.body;
    const id = req.params.u_id;

    if(!password){
        try {
            db.query(`Update user SET email = '${email}',username = '${username}',firstname = '${firstname}',
            lastname = '${lastname}', u_stat = '${u_stat}' WHERE u_id = '${id}' `,
            (err)=>{
                if(err){
                    console.log("Cann't Update Data",err);                
                    return res.status(400).send();
                }
                    return res.status(201).json({message: "Update user Success "});
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    }else{
        try {
            db.query(`Update user SET email = '${email}',username = '${username}',firstname = '${firstname}',
            lastname = '${lastname}', u_stat = '${u_stat}' WHERE u_id = '${id}' `,            
            (err)=>{
                if(err){
                    console.log("Cann't Update Data",err);                
                    return res.status(400).send();
                }
                    return res.status(201).json({message: "Update user Success "});
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    }

   
})

router.delete(`/users/deUser/:id`,(req,res)=>{
    const id = req.params.id;
    

    db.query(`delete from user where u_id = ${id} `,
    (err,result)=>{
        if(err){
           return res.status(400).send({
                code: err.code,
                message: err.message
            })
        }else{
            return res.status(200).send({
                message: 'Delete User Success',
                
            },console.log(id))
        }
    })
})

module.exports = router;