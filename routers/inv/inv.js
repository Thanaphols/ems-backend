const express = require('express');
const router = express.Router();
const db = require('../../db');
const multer = require('multer');
var profile_path = "";
const imageUploadPath = "../Frontend/assets/images";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,imageUploadPath);
    },
    filename: function (req, file, cb) {
      cb(null,`${file.originalname}`);
      images=`${file.originalname}`;
    },
  });

const imageUpload = multer({ storage: storage });

router.post('/upload', imageUpload.single("file"),(req, res) => {
    const name = req.body.i_name;
        const qty = parseInt(req.body.i_qty);
        const cate = req.body.c_id;
    //no img
    if(!req.file){
        if( !name || !qty || !cate ){
            return res.status(400).send({message: 'Please enter All Data'})
        }
        console.log(req.file)
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
    }
        if( !name || !qty || !cate){
            return res.status(400).send({message: 'Please enter All Data'})
        }
        try {
            db.query(
                `INSERT INTO inventory (i_name,i_category,i_qty,i_img) VALUES ('${name}','${ cate}','${ qty}','${images}') `,
                (err,results)=>{
                    if(err){
                        console.log("Can't insert Equipment",err);
                        return res.status(400);
                    }
                    return res.status(201).send({
                        data,
                        message: 'INSERT Equipment AND images Success!'
                      })
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
  })

  router.patch('/upEq/:e_id', imageUpload.single("file"),(req, res) => {
    const id = req.params.e_id;
    const name = req.body.i_name;
        const qty = parseInt(req.body.i_qty);
        const cate = req.body.c_id;
    // no img
    if(!req.file){
        if( !name || !qty || !cate ){
            return res.status(400).send({message: 'Please enter All Data'})
        }
        
        try {
            db.query(
                `UPDATE inventory SET i_name = '${name}',i_category = ${cate} ,i_qty = ${qty} 
                 WHERE i_id = ${id}`,
                (err,data)=>{
                    if(err){
                        console.log("Can't Update Equipment",err);
                        return res.status(400).send({message:"Can't Update Equipment "});
                    }
                    return res.status(201).send({
                        data,
                        message: 'Update Equipment Success!'
                      })
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send({message:"Can't Update Equipment "});
        }
    }else{
        if( !name || !qty || !cate){
            return res.status(400).send({message: 'Please enter All Data'})
        }
        try {
            db.query(
                `UPDATE inventory SET i_name = '${name}',i_category = ${cate},i_img = '${images}'
                WHERE i_id = ${id} `,
                (err,data)=>{
                    if(err){
                        console.log("Can't Update Equipment",err);
                        return res.status(400).send({message:"Can't Update Equipment images"});
                    }
                    return res.status(201).send({
                        data,
                        message: 'Update Equipment AND images Success!'
                      })
                }
            )
        } catch (error) {
            console.log(error);
            return res.status(500).send({message:"Can't Update Equipment image "});
        }
    }
        
  })

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
 // SELECT * FROM inventory WHERE c_id
  router.get('/inv/cate/:c_id',(req,res)=>{
    const id = req.params.c_id;
    db.query(`SELECT * FROM inventory  WHERE i_category = ${id}`,
    (err,data)=>{
        if(err){
            return res.status(400).send({message: 'Nodata'});
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
            return res.status(201).send(
                data
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