const jwt=require('jsonwebtoken')

module.exports=function(req,res,next){
    const token=req.header("auth-token");
    if(!token){
        return res.status(401).send("Access Denied")
    }
    try{
       const verifyuser=jwt.verify(token,process.env.Token_Secret)
       console.log(verifyuser)
       req.user=verifyuser
       next()
    }
    catch(error){
        res.status(400).send("Invalid Token")
    }
}