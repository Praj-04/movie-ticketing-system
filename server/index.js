const express = require('express')
const dotenv = require('dotenv')
dotenv.config('./.env')
const dbConnect = require('./dbConnect')
const authRouter = require('./routers/authRouter')
const morgan = require('morgan')


//configuration
const PORT = process.env.PORT || 4001

const app = express()

//middlewares
app.use(express.json())
app.use(morgan('common'))


//routes
app.use('/',authRouter)

app.get('/',(req,res)=>{
res.status(200).send('Server is up and running');
})

dbConnect();

app.listen(PORT,()=>{
console.log(`listening to PORT ${PORT}`)
})