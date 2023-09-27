const router = require("express").Router();
const Notification = require("../models/notification");

// get a user's notifications with pagination
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query; // Get page and limit from query parameters

    // Convert page and limit to integers (you can add validation here)
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the skip value to skip notifications from previous pages
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch notifications with pagination and sort by createdAt in descending order
    const notifications = await Notification.find({ externalId: id })
      .sort({ createdAt: -1 })
      .skip(skip) // Skip notifications from previous pages
      .limit(limitNumber); // Limit the number of notifications per page

    res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//post notification
router.post("/", async (req, res) => {
  const newNotification = new Notification(req.body);
  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Delete a particular notification
router.delete("/one/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a notification
router.delete("/", async (req, res) => {
  try {
    console.log(req.body);
    const deletedData = await Notification.findOneAndDelete({
      externalId: req.body.externalId,
      senderId: req.body.senderId,
      type: req.body.type,
      postId: req.body.postId,
    });
    console.log(deletedData);
    res.status(200).json(deletedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
