const express = require("express")
const auth = require("../middleware/auth")
const User = require("../model/User")
const logger = require("../Winstonlogger")
const router = new express.Router()


//route for creating a user in db
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send("User created successfully \n Token : " + token)
        logger.info({method : req.method, path : req.path, request : req.body, resHeader : res._header})
    }catch(e){
        res.status(400).send(e)
        logger.error({method : req.method, path : req.path, request : req.body, resHeader : res._header})

    }
})

//route for viewing our profile
router.get('/users/MyProfile',auth , async (req, res)=>{

    try{
        res.send(req.user)
        logger.info({method : req.method, path : req.path, request : req.user, resHeader : res._header})

    }catch(e){
        res.status(500).send(e)
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})

    }
})

//route to log in with email and password
router.post("/users/login",async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        if(!user){
            res.status(404).send("User doesn't exist.")
        }

        res.send("Successfully logged in.\n token : "+token)
        logger.info({method : req.method, path : req.path, request : req.body, resHeader : res._header})
    }catch(e){
        res.status(404).send("unable to login")
        logger.error({method : req.method, path : req.path, request : req.body, resHeader : res._header})
    }
})

//route to logout user from ongoing sessionif authenticated
router.post("/users/logout",auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send("Successfully logged out from the session.")
        logger.info({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }catch(e){
        res.status(500).send()
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }
})

//route to update the user profile if authenticated
router.patch("/users/update", auth ,async (req, res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'mobile', 'email', 'password']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send("Invalid update.")
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }

    try{
        updates.forEach((update)=> req.user[update] = req.body[update] )
        await req.user.save()
        res.send("User updated successfully.")
        logger.info({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }catch(e){
        res.status(400).send()
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }

})

//route to delete the user profile if authenticated
router.delete("/users/delete", auth , async(req, res)=>{
    try{
        await req.user.remove()
        res.send("User deleted successfully.")
        logger.info({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }catch(e){
        res.status(500).send()
        logger.error({method : req.method, path : req.path, request : req.user, resHeader : res._header})
    }
})

module.exports = router