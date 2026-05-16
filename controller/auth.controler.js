

const SignupController = async (req,res)=>{
    res.send("Signup Route");
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