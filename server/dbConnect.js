const mongoose = require('mongoose')

module.exports = async()=>{
    const PASS = process.env.PASS
    const mongoUri=`mongodb+srv://prajnayogish4:${PASS}@cluster0.65fzg5a.mongodb.net/?retryWrites=true&w=majority`

try {
    const connect = await mongoose.connect(mongoUri,{
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
    console.log(`mongodb is connected successfully : ${connect.connection.host}`)
} catch (error) {
    console.log(error);
    process.exit(1);
}
}