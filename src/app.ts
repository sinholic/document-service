import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import router from'./router'
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const db_dsn = process.env.DB_DSN || 'mongodb://localhost:27017/document-service';

mongoose.connect(db_dsn, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(router)


app.listen(port, () => {
    // console.log(process.env)
    console.log(`listen to port: ${port}`)
})