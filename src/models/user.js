const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        trim: true,
        lowercase: true
    },  
    age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        },
        default: 0
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// relationship between two Models (User and Task)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// statics are used for models(User)
userSchema.statics.findByCredentials = async(email,password) =>{
    const user = await User.findOne({email: email})

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// methods are used for instances(user)
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})
    await user.save()
        
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// hash the plaintext password before saving
userSchema.pre('save',async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

// delete tasks when user is removed
userSchema.pre('remove',async function(next) {
    const user = this

    await Task.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User