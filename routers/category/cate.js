const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/cate',(req,res)=>{
    db.query(`SELECT * FROM category `,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });

  router.get('/cate/:c_id',(req,res)=>{
    const id = req.params.c_id;

    db.query(`SELECT * FROM category WHERE c_id = ${id}`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });

  router.post('/cate/addCate/', async (req,res)=>{
    const name = req.body.c_name;
    if( !name ){
        return res.status(400).send({message: 'Please enter Category Name'})
    }
    
    try {
        db.query(
            `INSERT INTO category (c_name) VALUES ('${name}') `,
            (err,results)=>{
                if(err){
                    console.log("Can't insert Equipment",err);
                    return res.status(400);
                }
                return res.status(201).send({
                    message: 'INSERT Equipment Success!'
                  })
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
} );

  router.patch('/cate/upCate/:c_id',(req,res)=>{
    
    const id = req.params.c_id;
    const name = req.body.c_name;
    if (!name){
        console.log("Cann't Update Category");       
        return res.status(400).send({message: 'Please Enter Data' })
    }
    db.query(` UPDATE  category SET c_name =  '${name}' WHERE c_id = ${id}`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(200).send(
                { message: 'UPDATE Category Success'}
            )
        }
    })   
  });

  router.delete(`/cate/deCate/:c_id`,(req,res)=>{
    const id = req.params.c_id;
    db.query(`delete from category where c_id = ${id} `,
    (err,result)=>{
        if(err){
           return res.status(400).send({
                code: err.code,
                message: err.message
            })
        }else{
            return res.status(200).send({
                message: 'Delete Category Success'
            })
        }
    })
})

  
module.exports = router;