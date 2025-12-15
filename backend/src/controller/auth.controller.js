import User from "../models/user.js";
import jwt from "jsonwebtoken";

export async function signup(req,res){
    const {email,password,fullName} =  req.body;

    try{
        if(!email || !password || !fullName) {
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
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic:  randomAvtar,
        })

        //todo to craete user in stream as well 

        //  token for login sessionStorage 
        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,   // prevent ass attack
            sameSite: "strict",   //prevent csrf attck
            secure: process.env.NODE_ENV === "production",   // prevent http request
        })

        res.status(201).json({success:true,user:newUser})

    } catch(error) {
        console.log("error in signup controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};


//avatar-placeholder.iran.liara.run
export async function login(req,res){
    try {
        const {email , password}= req.body;
        if(!email || !password){
            return res.status(404).json({message : "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"Invalid email or password"});

        const isPasswordCorrect = await user.matchPassword(password);  
        if(!isPasswordCorrect) return res.status(401).json({message:"invalid email or password "});


        //  token for login sessionStorage 
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,   // prevent ass attack
            sameSite: "strict",   //prevent csrf attck
            secure: process.env.NODE_ENV === "production",   // prevent http request
        })

        res.status(201).json({success:true,user})

    } catch(error) {
        console.log("error in signup controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
    // res.send("login Route") 
};

export async function logout(req,res){



    res.clearCookie("jwt")   // as wa called cookie as jwt 
    res.status(200).json({success:true,message:"Succesfully Logout"});
    // res.send("logout Route")
};