import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema =  new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    bio:{
        type:String,
        default:"",
    },
    profilePic:{
        type:String,
        default:"",
    },
    nativeLanguage:{
        type:String,
        default:"",
    },
    learningLanguage:{
        type:String,
        default:"",
    },
    Location:{
        type:String,
        default:"",
    },
    isOnboarded:{
        type:Boolean,
        defaut:false,
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]

},  
    {timestamps:true}   
);

const user = mongoose.model("user",userSchema);
// to explain this one again in later video 
// prehook so that our password is encypted
// it just try to hash our password like 12443 =fsojvoisj that it 


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error)
    }
});



// ✅ Model (Capitalized by convention)
const User = mongoose.model("User", userSchema);


export default User;