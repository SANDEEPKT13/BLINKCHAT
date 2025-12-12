import express from "express";  // easy make api in that a
import "dotenv/config";


import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

// import dotenv from "dotenv";

// dotenv.config();  // dotenv.config() Loads values from your .env file into process.env.



const app = express();
const PORT = process.env.PORT  



// noob way of making routes 
// app.get("/api/auth/signup",(req,res)=>{    // 3 apis
//     res.send("Signup Route");
// });

// app.get("/api/auth/login",(req,res)=>{
//     res.send("login Route");
// });

// app.get("/api/auth/logout",(req,res)=>{
//     res.send("logout Route");
// });


// correct way 
app.use("/api/auth",authRoutes);   //“Every route defined inside authRoutes should start with /api/auth.”





app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});