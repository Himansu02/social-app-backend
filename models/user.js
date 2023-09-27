const mongoose=require("mongoose");

const UserSchema= new mongoose.Schema({
    externalId:{type:String},
    username:{type:String},
    firstname:{type:String},
    lastname:{type:String},
    fullname:{type:String},
    numbers:{type:Number},
    profile_img:{type:String},
    cover_img:{type:String},
    media:{type:Array},
    lastSignInAt:{type:Number},
    gender:{type:String},
    bio:{type:String},
    location:{type:String},
    dob:{type:String}
},

{timestamps:true}
)

module.exports=mongoose.model("User",UserSchema)