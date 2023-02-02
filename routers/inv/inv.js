const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/inv',(req,res)=>{
    db.query(`SELECT * FROM inventory `,
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

    // SELECT * FROM category
    router.get('/cate',(req,res)=>{
    db.query(`SELECT * FROM category `,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send(
                data
            )
        }
    })   
  });

  router.get('/invs',(req,res)=>{
    db.query(`SELECT * FROM inventory `,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(201).send({data}
            )
        }
    })   
  });

  router.get('/inv/:i_id',(req,res)=>{
    const id = req.params.i_id;
    
    db.query(`SELECT * FROM inventory WHERE i_id = ${id};`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            return res.status(200).send(
                data,
            )
        }
    })
});


  router.post('/inv/addInv/', async (req,res)=>{
    const name = req.body.i_name;
    const qty = parseInt(req.body.i_qty);
    const cate = req.body.c_id;
    if( !name || !qty || !cate){
        return res.status(400).send({message: 'Please enter All Data'})
    }
    try {
        db.query(
            `INSERT INTO inventory (i_name,i_category,i_qty) VALUES ('${name}','${ cate}','${ qty}') `,
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

router.delete(`/inv/deInv/:id`,(req,res)=>{
    const id = req.params.id;
    db.query(`delete from inventory where i_id = ${id} `,
    (err,result)=>{
        if(err){
           return res.status(400).send({
                code: err.code,
                message: err.message
            })
        }else{
            return res.status(200).send({
                message: 'Delete Inventory Success'
            })
        }
    })
})
  

    

// })

router.patch('/inv/upInv/:id', async (req,res) => {
    const name = req.body.i_name;
    const qty = req.body.i_qty;
    const c_id = req.body.c_id;
    const id = req.params.id;

    try {
        db.query(`Update inventory SET i_name = '${name}', i_category = '${c_id}', i_qty = '${qty}'  WHERE i_id = '${id}' `,
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

})



  
module.exports = router;