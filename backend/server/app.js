import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import webhookRouter from './routes/webhook.js';


//app config

const app=express()
const port=process.env.PORT || 4000
connectDB()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())

//api endpoint
app.use('/api/webhook', webhookRouter);

app.get('/',(req,res)=>{
    res.send("api working")
})

export default app
