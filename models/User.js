const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique: true,
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnboarded:{
        type:Boolean,
        default:false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})

// Pre hook -> Use to store hash password -> password encryption

UserSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (error) {
    console.log(error);
    return;
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    }catch(err){
        console.log(err);
        throw err;
    }
}

const User = mongoose.model("User",UserSchema)

module.exports = User;