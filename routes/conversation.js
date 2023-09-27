const router = require("express").Router();
const Conversation = require("../models/conversation");

//new conv

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const checkCoversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    console.log(checkCoversation);

    if (!checkCoversation) {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });

      const savedConversation = await newConversation.save();
      return res
        .status(200)
        .json({ conversation: savedConversation, status: "new" });
    } else {
      return res
        .status(200)
        .json({ conversation: checkCoversation, status: "exist" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a conersation
router.get("/one/:conversationId", async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const result = await Conversation.findById(conversationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
