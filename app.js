const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()


//middlewares
require('dotenv').config()
app.use(express.json())

//routes middlewares
app.use('/api', require('./routes/auth'))


//Starting server func...
start()

async function start() {
    try{
        await mongoose.connect(process.env.DB_CONNECT,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, () => {console.log('Db connected!')})

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => console.log(`🦦Server is running on port: ${PORT}🦦`))
    } catch(e) {
        console.log(e)
    }
}
