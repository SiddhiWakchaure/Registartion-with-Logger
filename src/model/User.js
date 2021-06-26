const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true
    },
    mobile : {
        type : Number,
        trim : true,
        required : true,
        validate(value){
            if(!validator.isMobilePhone(value.toString())) { //validates for mobile numbers of all over the world.
                throw new Error("Please check and re-enter your mobile number.")
            }
        }
    },
    email : {
        type : String,
        trim : true,
        required : true,
        lowercase : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter valid email address.")
            }
        }
    }, 
    password : {
        type : String,
        trim : true,
        required : true,
        // minlength : 8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please re-enter a password with minlength 8, minimum 1 uppercase letter,lowercase letter,special character and number. ")
            }

        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET )

    user.tokens = user.tokens.concat({token})

    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password)=>{

    const user = await User.findOne({email})

    if(!user){
        throw new Error("Unable to login.")
    }

    if (user.password === password){
        return user
    }else {
        throw new Error("Unable to login.")
    }
}

const User = mongoose.model("User" , userSchema)

module.exports = User