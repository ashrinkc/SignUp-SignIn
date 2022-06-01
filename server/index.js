const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
  });

mongoose.connect("mongodb+srv://Ashrin:ashrin@cluster0.vks9n.mongodb.net/Cluster0?retryWrites=true&w=majority").then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err)
})

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const User = mongoose.model("User",userSchema)

app.post("/login",(req,res)=>{
    const {email,password} = req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password===user.password){
                res.send({message:"Login Successfull",user:user})
            }else{
                res.send({message:"password did not match"})
            }
        }else{
            res.send({message:"User not registered"})
        }
    })

})

app.post("/register",(req,res)=>{
    const{name,email,password}=req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"user already exists"})
        }else{
            const user = new User({
                name,
                email,
                password
            })
            user.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"Successfully registered"})
                }
            })
        }
    })
   
})

app.listen(5000,()=>{
    console.log("Running...")
})