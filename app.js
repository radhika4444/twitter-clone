const express=require('express')
const app=express()
const bodyparser=require('body-parser')
//const morgan=require('morgan')
const mongoose=require('mongoose')
let cors = require("cors");
const dotenv = require('dotenv') 

dotenv.config();

mongoose.set('strictQuery', false);

const user=require('./routes/users')
const tweets=require('./routes/tweets')

app.use(cors());

app.use(bodyparser.urlencoded({extended:false}))  
app.use(bodyparser.json()) 

//app.use(morgan('dev'))  

mongoose.connect(`mongodb+srv://radhikamittal:1234@cluster0.3z6rp2t.mongodb.net/Twitter?retryWrites=true&w=majority`)
     .then(console.log('connection to db succesful'))
     .catch(error=>console.log(error))

app.use('/api/user',user)
app.use('/api',tweets)

app.use((req,res)=>{ 
    res.status(404).json({msg:"seems like u are lost , please try again with the route"})
})
module.exports=app; 