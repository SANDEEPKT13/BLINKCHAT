import User from "../models/user.js";
import jwt from "jsonwebtoken";

export async function signup(req,res){
    const {email,password,fullname} =  req.body;

    try{
        if(!email || !password || !fullname) {
            return res.status(400).json({message: "All feilds are required"});
        }
        if(password.length <6){
            return res.status(400).json({message: "Atleast 6 characaters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){ 
             return res.status(400).json({message: "Email already existed ,please use different email"});
        }

        const idx = Math.floor(Math.random()*100)+1;      //generate a random no 1-100
        const randomAvtar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`
        const newUser = new User.create({
            email,
            username,
            password,
            profilePic:  randomAvtar,
        })

        //todo to craete user in stream as ell 


        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*68*1000,
            httpOnly:true,   // prevent ass attack
            sameSite: "strict",   //prevent csrf attck
            secure: process.env.NODE_ENV === "production",   // prevent http request
        })

        res,status(201).json({success:true,user:newUser})

    } catch(error) {
        console.log("error in signup controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};


//avatar-placeholder.iran.liara.run
export async function login(req,res){
    res.send("login Route")
};

export async function logout(req,res){
    res.send("logout Route")
};