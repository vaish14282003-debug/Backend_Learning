const express = require("express");
const router = express.Router();

const notificationQueue = require("../queues/notification.queue");

// POST /jobs
router.post("/", async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const job = await notificationQueue.add("send-notification", {
      message: message.trim(),
    });

    return res.status(202).json({
      success: true,
      message: "Background job added successfully",
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
