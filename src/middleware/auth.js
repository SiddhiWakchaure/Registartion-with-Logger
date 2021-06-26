const jwt = require("jsonwebtoken")
const User = require("../model/User")
const logger = require("../Winstonlogger")

const auth = async(req, res, next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "thisisregistrationspage") //verifying whether the token made on collections secret string

        //find user who owns this token
        const user = await User.findOne({_id : decoded._id, "tokens.token":token })

        if(!user){
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    }catch(e){
        res.status(404).send("Please authenticate.")
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})

    }
}

module.exports = auth