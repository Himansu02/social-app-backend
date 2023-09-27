const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId:{type:String,required:true},
    senderId:{type:String,required:true},
    receiverId:{type:String,required:true},
    text:{type:String},
    likes:{type:Array}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);