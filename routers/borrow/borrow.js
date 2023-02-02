const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/borrow',(req,res)=>{
    db.query(`SELECT * FROM borrow WHERE b_stat = 'Borrow'`,
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

  router.get('/return',(req,res)=>{
    db.query(`SELECT * FROM borrow WHERE b_stat = 'return'`,
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
                 ${i_id},NOW(),"${u_stat}","Borrow",${i_qty}) `,
                (err,results)=>{
                    if(err){    
                        console.log("Can't Borrow Equment",err);
                        return res.status(400);
                    }
                    db.query(
                        `UPDATE inventory SET  i_qty = ${total} WHERE i_id = ${i_id} `,
                        (err,results)=>{
                            if(err){    
                                console.log(err);
                                return res.status(400).send({message: "Can't Borrow Equment"});
                            }else{}
                            return res.status(201).send({message: "Borrow Equment Success"})
                        }
                    )
                }
            )
        
    
} );

// เรียกประวัติการยืมของ user id ที่ login WHERE borrow
router.get('/borrow/borrow/:u_id',(req,res)=>{
    const id = req.params.u_id;
    db.query(`SELECT * FROM borrow WHERE u_id = ${id} AND b_stat = 'Borrow' ;`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data==0){
                return res.status(400).send( {message: 'No borrow data' },data )
            }
            return res.status(201).send(
                data,
            )
        }
    })
});

// เรียกประวัติการยืมของ user id ที่ login WHERE return
router.get('/borrow/return/:u_id',(req,res)=>{
    const id = req.params.u_id;
    db.query(`SELECT * FROM borrow WHERE u_id = ${id} AND b_stat = 'return' ;`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            if(data==0){
                return res.status(400).send( {message: 'No Return data' },data )
            }
            return res.status(201).send(
                data,
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
                        console.log(err);
                        return res.status(400).send({message: "Can't Borrow Equment"});
                    }else{}
                    return res.status(201).send({message: "Borrow Equment Success"})
                }
            )
        }
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
                console.log("Cann't Update Data",err);                
                return res.status(400).send();
            }
            db.query(
                `UPDATE inventory SET  i_qty = i_qty+${b_qty}  WHERE i_id = ${i_id} `,
                (err,results)=>{
                    if(err){    
                        console.log(err);
                        return res.status(400).send({message: "Can't return Equment"});
                    }else{}
                    return res.status(201).json({message: "Return equipment Success "});
                }
            )
                


                
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }

})


module.exports = router;