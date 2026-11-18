const notificationQueue = require("./notification.queue");

async function addJob() {
  const job = await notificationQueue.add("send-notification", {
    message: "Hello Vaishnavi! Your first background job is ready.",
  });

  console.log("Job added successfully:", job.id);

  await notificationQueue.close();
}

addJob().catch(console.error);
