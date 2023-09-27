const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    externalId: { type: String ,required:true},
    type:{type:Number},
    text:{type:String},
    postId:{type:String},
    commentId:{type:String},
    senderId:{type:String}
  },

  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
