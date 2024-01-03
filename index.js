const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

// Database connection
mongoose.connect(process.env.MongoDB_URL)
    .then(() => console.log('conneted Database'))
    .catch((err) => console.log(err))

//Route
app.use('/', require('./Route/authRoutes'))

const port = process.env.port || 8000
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})