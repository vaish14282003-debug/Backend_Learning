const { Worker } = require("bullmq");

const worker = new Worker(
  "notification-queue",
  async (job) => {
    console.log("Processing job:", job.id);
    console.log("Notification message:", job.data.message);

    // Simulate sending a notification
    console.log("Notification sent successfully!");
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log("Notification worker is running...");
