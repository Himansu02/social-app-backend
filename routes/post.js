const router = require("express").Router();
const Post = require("../models/post");
const Notification = require("../models/notification");

//GET all posts
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Parse the page parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Parse the limit parameter, default to 10

    const skip = (page - 1) * limit; // Calculate the number of posts to skip

    const data = await Post.find()
      .populate("postedBy", "externalId username fullname profile_img")
      .sort({ createdAt: -1 })
      .skip(skip) // Skip posts based on the page and limit
      .limit(limit); // Limit the number of posts returned per request
    res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    const updateData = await Post.findById(req.params.id).populate(
      "postedBy",
      "externalId username fullname profile_img"
    );

    console.log(updateData);
    res.status(200).json(updateData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//POST a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const originalData = await Post.findById(savedPost._id).populate(
      "postedBy",
      "externalId username fullname profile_img"
    );
    res.status(200).json(originalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("post deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a particular post
router.get("/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id).populate(
      "postedBy",
      "externalId username fullname profile_img"
    );
    res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//put a post like
router.put("/:id/like", async (req, res) => {
  try {
    const updatedData = await Post.findByIdAndUpdate(req.params.id, {
      $push: { like: req.body.userId },
    });
    const newNotification = new Notification({
      senderId: req.body.userId,
      externalId: req.body.receverId,
      postId:req.params.id,
      type:1
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
    const updatedData = await Post.findByIdAndUpdate(req.params.id, {
      $pull: { like: req.body.userId },
    });
    const query={
      externalId:req.body.receverId,
      senderId:req.body.userId,
      postId:req.params.id,
      type:1
    }
    const deleteNotification=await Notification.findOneAndDelete(query)
    console.log(deleteNotification)
    res.status(200).json(updatedData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET timeline posts with pagination
router.get("/timeline/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const { page, limit } = req.query; // Get page and limit from query parameters

    // Convert page and limit to integers (you can add validation here)
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the skip value to skip posts from previous pages
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch timeline posts with pagination and sort by createdAt in descending order
    const data = await Post.find()
      .populate("postedBy", "externalId fullname username profile_img")
      .sort({ createdAt: -1 })
      .skip(skip) // Skip posts from previous pages
      .limit(limitNumber); // Limit the number of posts per page

    // Filter the posts to include only those posted by the specified user
    const result = data.filter((post) => post.postedBy.externalId === userId);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
