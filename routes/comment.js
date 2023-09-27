const router = require("express").Router();
const Comment = require("../models/comment");
const Notification = require("../models/notification")

// GET post comments with pagination
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
      const { page, limit } = req.query; // Get page and limit from query parameters

      // Convert page and limit to integers (you can add validation here)
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      // Calculate the skip value to skip comments from previous pages
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch post comments with pagination and sort by createdAt in descending order
      const comments = await Comment.find({ postId })
          .sort({ createdAt: -1 })
          .skip(skip) // Skip comments from previous pages
          .limit(limitNumber); // Limit the number of comments per page

      return res.status(200).json(comments);
  } catch (err) {
      return res.status(500).json(err);
  }
});

//post a comment
router.post('/',async(req,res)=>{
    const newComment=new Comment(req.body)
    try{
        const savedComment=await newComment.save()
        res.status(200).json(savedComment)
    }catch(err){
        res.status(500).json(err)
    }
})

//update commet like
router.put("/:id/like", async (req, res) => {
    try {
      const updatedData = await Comment.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.body.userId },
      });
      const newNotification = new Notification({
        senderId: req.body.userId,
        externalId: req.body.receverId,
        postId:req.body.postId,
        type:3,
        commentId:req.params.id
      });
      const savedNotification = await newNotification.save();
      console.log(savedNotification)
      res.status(200).json(updatedData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //put a post unLike
router.put("/:id/unlike", async (req, res) => {
    try {
      const updatedData = await Comment.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.body.userId },
      });
      const query={
        externalId:req.body.receverId,
        senderId:req.body.userId,
        postId:req.body.postId,
        type:3,
        commentId:req.params.id
      }
      const deleteNotification=await Notification.findOneAndDelete(query)
      console.log(deleteNotification)
      res.status(200).json(updatedData)
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //Delete a comment
  router.delete("/:id",async(req,res)=>{
    try{
      await Comment.findByIdAndDelete(req.params.id)
      res.status(200).json("deleted")
    }catch(err){
      res.status(500).json(err)
    }
  })


module.exports = router;