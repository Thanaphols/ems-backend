const express = require('express')
require('dotenv').config()
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../../db/index')
const { verifyToken } = require('../../middleware/authJwt')
const authJwt = require('../../middleware/authJwt')
const userMiddleware = require('../../middleware/user')

router.post('/login', userMiddleware.validateRegister,  (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    db.query(
      `SELECT * FROM user  WHERE email = '${email}'  AND password = '${password}';`,
      (err, result) => {
        // user does not exists
        if (err) {
          return res.status(400).send({
            code: err.code,
            message: err.message
          })
        } else {
          if (result.length === 0) {
            return res.status(404).send({
              message: 'Email or Password wrong '
            })
          } else {
            const userData = {
            email: result[0].email,
              username: result[0].username,
              firstname: result[0].firstname,
              lastname: result[0].lastname,
              password: result[0].password,
              u_stat: result[0].u_stat,
              u_id: result[0].u_id
            }
            if(userData.u_stat == 'NotApproved'){
              return res.status(403).send({
                message: 'Require Admin To Approved'
              })
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
              expiresIn: '1h'
            }
            jwt.sign(userData, secret, options, (err, token) => {
              if (err) {
                console.log(err)
              } else {
                return res.status(200).send({
                  message: 'Logged in!',
                  token,
                  user: result[0]
                })
              }
            })
          }
        }
      }
    )
  })

  router.get('/me', authJwt.verifyToken, (req, res, next) => {
    //   console.log(req.user);
    res.send(req.user)
    
  })



  
module.exports = router;