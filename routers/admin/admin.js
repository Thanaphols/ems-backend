const express = require('express');
const router = express.Router();
const db = require('../../db');

// Admin  Update user Where id && uesr Status
router.patch('/admin/adupUser/:u_id', async (req,res) => {
    
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
// admin submit borrow
router.patch('/admin/upBorrow/:id/:qty/:id2', async (req,res) => {
    const  b_id= req.params.id;
   const b_qty= req.params.qty;
   const i_id= req.params.id2;

    try {
        db.query(`Update borrow SET b_stat = 'Borrow',b_date = NOW()   WHERE b_id = '${b_id}' `,
        (err)=>{
            if(err){
                console.log("Cann't Update Data",err);                
                return res.status(400).send();
            }
            db.query(
                `UPDATE inventory SET  i_qty = i_qty-${b_qty}  WHERE i_id = ${i_id} `,
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

router.patch('/admin/upWait/:b_id/:i_qty/:i_id',(req,res)=>{
    const b_id = req.params.b_id;
    const i_id = req.params.i_id;
    const i_qty = req.params.i_qty;
    db.query(`SELECT i_qty FROM inventory  WHERE i_id = ${i_id}`,
    (err,data)=>{
        if(err){
            return res.status(400);
        }else{
            const total = data[0].i_qty-i_qty
            if(total<0){
                return res.status(401).send(
                    {message: 'Out of Stock'}
                    )
            }
            try {
                db.query(`Update borrow SET b_stat = 'Borrow',b_date = NOW()   WHERE b_id = '${b_id}' `,
        (err)=>{
            if(err){
                console.log("Cann't Borrow Data",b_id,err);                
                return res.status(400).send();
            }
            db.query(
                `UPDATE inventory SET  i_qty = ${total}  WHERE i_id = ${i_id} `,
                (err,results)=>{
                    if(err){    
                        console.log(err);
                        return res.status(400).send({message: "Can't return Equment"});
                    }else{}
                    return res.status(201).json({message: "Approve Borrow Success "});
                }
            )
            }
        )
            } catch (error) {
                console.log(error);
                 return res.status(500).send();
            }
        }
    })
})

router.delete(`/admin/deWait/:id/`,(req,res)=>{
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

// Admin delete Catagory AND CHECK Equipment ues Category WHERE catagory_id
router.delete(`/admin/deCate/:c_id/`,(req,res)=>{
    const id = req.params.c_id;
    db.query(`SELECT i_category FROM inventory WHERE i_category = ${id}`,
    (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send('Someting Wrong')
        }
        if(result.length!=0){
            return res.status(400).send("Have Equipment  Used Catagory Cann't Delete")
        }
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
   
})

// Admin delete Inventory AND CHECK User Borrow Equipment  WHERE Equipment ID
router.delete(`/admin/deInv/:id`,(req,res)=>{
    const id = req.params.id;
    db.query(`SELECT i_id FROM borrow WHERE i_id = ${id} `,
    (err,result)=>{
        if(err){
            return res.status(400).send({message: 'Someting Whenwrong'})
        }
        if(result.length !=0){
            return res.status(400).send({message: 'Have data in Bororw or Return or Request using this Equipment '})
        }
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
    
})

module.exports = router;
