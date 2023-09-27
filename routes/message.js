const router = require("express").Router();
const Message = require("../models/message");

//add

router.post("/", async (req, res) => {
  console.log(req.body)
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get last message

router.get("/:conversationId/lastmessage", async (req, res) => {
  try {
    const lastMessageArray = await Message.find({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: -1 })
      .limit(1);
      let lastMessage=null
    if(lastMessageArray.length>0)
    {
      lastMessage=lastMessageArray[0]
    }
    res.status(200).json(lastMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Delete a Message
router.delete("/:id",async(req,res)=>{
  try{
    await Message.findByIdAndDelete(req.params.id)
    res.status(200).json("deleted")
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;
