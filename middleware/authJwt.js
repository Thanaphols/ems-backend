const jwt = require('jsonwebtoken')
const db = require('../db/index.js')
require('dotenv').config()

verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Unknown Token'
    })
  }
  let token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized! Token is expire'
      })
    }
    req.user = decoded
    next()
  })
}

isApp = async (req, res, next) => {
 console.log( req.u_stat)
  try {
    if ( req.u_stat === 'NotApproved'  ) {
      return next()
    }
    return res.status(403).send({
      message: 'Require Admin To Approved'
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to validate User role!',
    })
  }
}

const authJwt = {
  verifyToken,
  isApp,
}
module.exports = authJwt