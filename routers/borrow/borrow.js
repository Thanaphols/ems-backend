const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/wait',(req,res)=>{
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.b_stat = 'wait'`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data.length == 0){
                return res.status(201).send(data,{message: 'No Data'});
            }
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });


router.get('/borrow',(req,res)=>{
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.b_stat = 'Borrow'`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data.length == 0){
                return res.status(204).send(data,{message: 'No Data'});
            }
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });

  router.get('/borrow/:b_id',(req,res)=>{
    
    const id = req.params.b_id;
    
    db.query(`SELECT inventory.i_category,inventory.i_qty,borrow.i_id,borrow.b_qty
    FROM borrow LEFT JOIN inventory ON borrow.i_id = inventory.i_id  
    WHERE b_id = ${id}`,
    (err,data)=>{
        if(err){
            return res.status(400).send({message:'No data'},err);
        }else{
            
            return res.status(201).send(
                data
            )
        }
    })   
  });

  router.get('/return',(req,res)=>{
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.b_stat = 'return'`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data.length == 0){
                return res.status(204).send(data,{message: 'No Data'});
            }
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });
  

  router.post('/borrow/addBorrow', async (req,res)=>{
    const u_id = req.body.u_id;
    const u_stat = req.body.u_stat;
    const i_id = req.body.i_id;
    const i_cate = req.body.c_id;
    const i_qty = parseInt(req.body.i_qty);
    // จำนวนที่มีในคลัง
    const qty = req.body.qty;

    // หักจำนวนที่ยืมออกจากคลัง
    const total = (qty)-i_qty;

    
    if( !u_stat ||!u_id || !i_id ||  !i_cate || !i_qty || !qty){
        return res.status(400).send({ message: "Please enter All data" })
    }
    if(total < 0){
            return res.status(400).send({ message: "Out of Stock" })
        }
            db.query(
                `INSERT INTO borrow (u_id,i_id,b_date,u_stat,b_stat,b_qty) VALUES (${u_id}, 
                 ${i_id},NOW(),"${u_stat}","wait",${i_qty}) `,
                (err,results)=>{
                    if(err){    
                        console.log(err);
                        return res.status(400).send({message: "Can't borrow something wrong"},err);
                    }
                    return res.status(201).send({message: "Send Request Success Please Wait"})
                }
            )
        
    
} );

// เรียกประวัติการยืมของ user id ที่ login WHERE wait
router.get('/borrow/wait/:u_id',(req,res)=>{
    const id = req.params.u_id; 
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.u_id = ${id} AND borrow.b_stat = 'wait'
    ;`,
    (err,data)=>{
        if(err){
            return res.status(400).send({message: 'No data'  });
        }else{
            return res.status(201).send(
                data,
                { total:data.length}
            )
        }
    })   
  });


// เรียกประวัติการยืมของ user id ที่ login WHERE borrow
router.get('/borrow/borrow/:u_id',(req,res)=>{
    const id = req.params.u_id;
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.u_id = ${id} AND borrow.b_stat = 'Borrow'
    ;`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data==0){
                return res.status(400).send( {message: 'No borrow data' },data )
            }
            return res.status(201).send(
                data, { total:data.length}
            )
        }
    })
});

// เรียกประวัติการยืมของ user id ที่ login WHERE return
router.get('/borrow/return/:u_id',(req,res)=>{
    const id = req.params.u_id;
    db.query(`SELECT borrow.*, user.username, inventory.i_name,inventory.i_img,category.c_name
    FROM borrow 
    LEFT JOIN inventory ON borrow.i_id = inventory.i_id 
    LEFT JOIN user ON borrow.u_id = user.u_id 
    LEFT JOIN category ON inventory.i_category = category.c_id
    WHERE borrow.u_id = ${id} AND borrow.b_stat = 'return' `,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data==0){
                return res.status(400).send( {message: 'No Return data' },data )
            }
            return res.status(201).send(
                data, { total:data.length}
            )
        }
    })
});



router.delete(`/borrow/deBorrow/:id/:qty/:id2`,(req,res)=>{
   const  b_id= req.params.id;
   const b_qty= req.params.qty;
   const i_id= req.params.id2;
    db.query(`delete from borrow where b_id = ${b_id} `,
    (err,result)=>{
        if(err){
           return res.status(400).send({
                code: err.code,
                message: err.message
            })
        }else{
            db.query(
                `UPDATE inventory SET  i_qty = i_qty + ${b_qty} WHERE i_id = ${i_id} `,
                (err,results)=>{
                    if(err){    
                        
                        return res.status(400).send({message: "Can't Borrow Equment"});
                    }else{}
                    return res.status(201).send({message: "Borrow Equment Success"})
                }
            )
        }
    })
})

router.delete(`/borrow/deWait/:id/`,(req,res)=>{
    const  b_id= req.params.id;
     db.query(`delete from borrow where b_id = ${b_id} `,
     (err,result)=>{
         if(err){
            return res.status(400).send({
                 code: err.code,
                 message: err.message
             })
            }
            return res.status(201).send({message: "Delete Borrow Request Success"})
     })
 })

router.patch('/borrow/return/:id/:qty/:id2', async (req,res) => {
    const  b_id= req.params.id;
   const b_qty= req.params.qty;
   const i_id= req.params.id2;

    try {
        db.query(`Update borrow SET b_stat = 'return',b_return = NOW()   WHERE b_id = '${b_id}' `,
        (err)=>{
            if(err){
                return res.status(400).send({message: "Can't Return"});
            }
            db.query(
                `UPDATE inventory SET  i_qty = i_qty+${b_qty}  WHERE i_id = ${i_id} `,
                (err,results)=>{
                    if(err){    
                        return res.status(400).send({message: "Can't return Equment"});
                    }else{}
                    return res.status(201).json({message: "Return equipment Success "});
                }
            )
            }
        )
    } catch (error) {
        return res.status(500).send({message: "Cann't Delete "});
    }
})

router.patch('/borrow/upBorrow/:b_id', async (req,res)=>{
    const id = req.params.b_id
    const u_id = req.body.u_id;
    const i_id = req.body.i_id;
    const i_cate = req.body.c_id;
    const i_qty = parseInt(req.body.i_qty);
    // จำนวนที่มีในคลัง
    const qty = req.body.qty;

    // หักจำนวนที่ยืมออกจากคลัง
    const total = (qty)-i_qty;

    
    if( !u_id || !i_id ||  !i_cate || !i_qty || !qty){
        return res.status(400).send({ message: "Please enter All data" })
    }
    if(total < 0){
            return res.status(400).send({ message: "Out of Stock" })
        }
            db.query(
                `UPDATE  borrow SET  u_id = ${u_id} , i_id = ${i_id} , b_date = NOW() 
                ,b_qty = ${i_qty} WHERE b_id = ${id} `,
                (err,results)=>{
                    if(err){ 
                        console.log(err)
                        return res.status(400).send({message: "Cann't Update Request" });
                    }
                    return res.status(201).send({message: "Update Request Success Please Wait"})
                }
            )
        
    
} );


module.exports = router;