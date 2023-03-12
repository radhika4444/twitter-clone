const express=require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const joi=require('joi')
//const verify=require('../authVerify')

const registerSchema=joi.object({
    username:joi.string().required(),
    email:joi.string().required().email(),
    password:joi.string().required().min(8)
})

router.post('/register',async(req, res) => {
    try{
        const {error}=await registerSchema.validateAsync(req.body)
        const saltround=10
        bcrypt.hash(req.body.password,saltround)
        .then(result=>{
            const user=new User({
                _id:new mongoose.Types.ObjectId(),
                username:req.body.username,
                email:req.body.email,
                password:result
            })
            User.find({email:req.body.email})
            .then(result=>{
                if(result.length === 0){
                    user.save()
                    .then(result=>res.status(201).json({message:"user signup succesful",userdetails:result}))
                    .catch(error=>res.status(500).json({message:"error ocurred in db",err:error}))
                }
                else{
                    res.status(400).json({message:"email already exists,try again with diff email"})
                }
            })
            .catch(error=>res.status(500).json({message:"error ocurred in db",err:error}))
        })
        .catch(error=>res.status(500).json({message:"server encountered an error",err:error}))
    }
    catch(error){
        res.status(500).json({message:"server encountered an error",err:error})
    }
})

router.patch('/register',async (req,res)=>{
            const userEmail=req.body.email
            const useroldpasswrd=req.body.password
            const usernewpasswrd=req.body.newpassword
            const salt=await bcrypt.genSalt(10);
            const hashedpasswd=await bcrypt.hash(usernewpasswrd,salt)
            User.find({email:userEmail})
            .then(result=>{
                if(result.length===0){
                    res.status(400).json({mssg:"user dont exist"})
                }
                else{
                    bcrypt.compare(useroldpasswrd,result[0].password)
                      .then(cmp=>{
                       if(cmp){
                            updateduser={
                                _id:result[0]._id,
                                email:result[0].email,
                                username:result[0].username,
                                password:hashedpasswd
                            }
                            User.findByIdAndUpdate(result[0]._id,updateduser)
                            .then(
                                updatedresult=>res.status(200).json({
                                    mssg:"user details updated",
                                    updateduser:updatedresult
                                })
                            )
                            .catch(
                                err=>res.status(500).json({mssg:"error occured in db",error:err})
                            )  
                       }
                       else{
                           res.status(400).json({mssg:"old password didnt match"})
                       }
                })
            }})
            .catch(error=>res.status(500).json({mssg:"error ocured in db",err:error}))

})

router.post('/login',(req, res) => {
	const userEmail=req.body.email
    User.find({email:userEmail})
         .then(result=>{ 
            if(result.length === 0){ 
                res.status(400).json({message:"user dont exist ,try again with different email"})
            }
            else{ 
                bcrypt.compare(req.body.password,result[0].password)
                   .then(cmp=>{
                       if(cmp){
                            //const token=jwt.sign({_id:user._id},process.env.Token_Secret)
                            const loggedinuser={
                                email:req.body.email,
                                password:req.body.password,
                                username:req.body.username
                            }
                            //res.header("auth-token",token).send(token)
                            res.status(400).json({message:"Auth succesful",userloggedin:loggedinuser})
                       }
                       else{
                            res.status(400).json({message:"Auth unsuccesful,check ur password"})
                       }
                   })
            }
         })
         .catch(err=>res.status(500).json({message:"database error",error:err})) 
})

router.get('/getall',async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
      }
      catch (err) {
        res.status(500).json(err);
    }
})



module.exports=router ;