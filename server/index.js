const express = require('express')
const dotenv = require('dotenv')
dotenv.config('./.env')
const dbConnect = require('./dbConnect')

const PORT = process.env.PORT || 4001

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
res.status(200).send('Server is up and running');
})

dbConnect();

app.listen(PORT,()=>{
console.log(`listening to PORT ${PORT}`)
})