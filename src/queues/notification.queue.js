const { Queue } = require("bullmq");

const notificationQueue = new Queue("notification-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

module.exports = notificationQueue;
