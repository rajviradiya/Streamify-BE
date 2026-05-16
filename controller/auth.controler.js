const User = require("../models/User");
const jwt = require("jsonwebtoken");

const SignupController = async (req,res)=>{
    const {email, password, fullName} = req.body;

    try{
        // all fieldrequired validation
        if(!email || !password || !fullName ) {
            return res.status(400).json({message: "All fields are required"});
        }

        //password length validation
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        //email formate validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"InvalidEmail Formate"})
        }

        //existing user validation
        const  existingUser = await User.findOne({email:email})
        if(existingUser){
            return res.status(400).json({message:"Email already exists, please use a different one"})
        }

        //create new user
        const idx = Math.floor(Math.random() * 100) + 1; 

        const profileAvtar = `https://i.pravatar.cc/150?img=${idx}`;

        const newUser = await User.create({
            fullname:fullName,
            email:email,
            password:password,
            profilePic:profileAvtar
        })

        const tocken = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1d"});

        res.cookie("jwttoken",tocken,{
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
            sameSite: "strict" // Adjust sameSite attribute as needed
        })
        
        res.status(201).json({success: true, message:"User created successfully", user:newUser, token:tocken})
    }catch(err){
        console.error("Error in SignupController:", err);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

    console.log("Signup Route");
};

const LoginController  = async (req,res)=>{
    res.send("Login Route");
    console.log("Login Route");
};

const LogoutController = async(req,res)=>{
    res.send("Logout Route");
    console.log("Logout Route");
};

module.exports = {
    SignupController,
    LoginController,
    LogoutController
}