const mongoose=require("mongoose");

const PostSchema= new mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    desc:{type:String},
    location:{type:String},
    image:{type:Array},
    like:{type:Array},
    comment:{type:Array}
},

{timestamps:true}
)

module.exports=mongoose.model("Post",PostSchema)