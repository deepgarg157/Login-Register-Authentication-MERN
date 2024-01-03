const express = require('express')
const router = express.Router()
const cors = require('cors')
const {user, resgisterUser , loginUser, getProfile} = require('../Controllers/authController')

router.use(cors(
    {
        credentials: "http://localhost:5173/",
        origin: true
    }
))

router.get("/", user)
router.post('/register', resgisterUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)

module.exports = router