const { hashedPassword, comparePassword } = require("../helper/auth")
const User = require("../model/User")
const jwt = require('jsonwebtoken')

// all register users
const user = async (req, res) => {
    try {
        const user = await User.find()
        if (user) {
            return res.json({
                data: user
            })
        }
        else {
            return res.json({
                data: null
            })
        }
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

// register
const resgisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name) {
            return res.json({
                error: "please enter the name is required"
            })
        }

        if (!email) {
            return res.json({
                error: "please enter the email is required"
            })
        }

        if (!password || password <= 6) {
            return res.json({
                error: "please enter the password is required and should me more then 6 charater"
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({
                error: 'user is already register'
            })
        }

        const hashPassword = await hashedPassword(password)
        // create the user
        const user = await User.create({ name, email, password: hashPassword })
        return res.json({
            user
        })

    } catch (error) {
        return res.json({
            error: error
        })
    }
}

// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                error: "user is not exist, please register first"
            })
        }

        if (!password) {
            return res.json({
                error: "please enter the password is required"
            })
        }

        // password matched
        const comparePass = await comparePassword(password, user.password)
        if (comparePass) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWTSecretKey, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json(user)
            })
        }
        else {
            return res.json({
                error: 'password is not matched'
            })
        }
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

// verify the token
const getProfile = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWTSecretKey, {}, (err, user) => {
            if (err) throw err
            return res.json(user)
        })
    }
    else {
        return res.json(null)
    }

}

module.exports = { user, resgisterUser, loginUser, getProfile }