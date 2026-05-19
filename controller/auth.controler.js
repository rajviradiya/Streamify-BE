const User = require("../models/User");
const jwt = require("jsonwebtoken");

const SignupController = async (req,res)=>{
    const {email, password, fullName} = req.body;

    try{
        // all field required validation
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

        const profileAvatar = `https://i.pravatar.cc/150?img=${idx}`;

        const newUser = await User.create({
            fullname:fullName,
            email:email,
            password:password,
            profilePic:profileAvatar
        })

        // create JWT token
        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1d"});

        res.cookie("jwtToken",token,{
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
            sameSite: "strict" // Adjust sameSite attribute as needed
        })
        
        res.status(201).json({success: true, message:"User created successfully", user:newUser, token:token})
    }catch(err){
        console.error("Error in SignupController:", err);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

    console.log("Signup Route");
};

const LoginController  = async (req,res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message:"Email and password are required"});
        }

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({success:false, message:"Invalid email or password"});
        }

        const isPasswordMatch = await user.comparePassword(password);

        if(!isPasswordMatch){
            return res.status(400).json({success:false, message:"Invalid email or password"});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});

        res.cookie("jwtToken",token,{
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
            sameSite: "strict" // Adjust sameSite attribute as needed
        })

        res.status(200).json({success:true, message:"Login successful", user:user, token:token})
    }catch(err){
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
    console.log("Login Route");
};

const LogoutController = async(req,res)=>{
    res.clearCookie("jwtToken");
    res.status(200).json({success:true, message:"Logout successful"});
    console.log("Logout Route");
};

module.exports = {
    SignupController,
    LoginController,
    LogoutController
}