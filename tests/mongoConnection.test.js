const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("MongoDB connection under Jest", () => {
  let mongoServer;
console.log("Jest environment:", process.env.JEST_WORKER_ID);
console.log("MongoDB driver:", require("mongodb/package.json").version);
  beforeAll(async () => {
    console.log("Starting MongoMemoryServer...");
  //  mongoServer = await MongoMemoryServer.create();
mongoServer = await MongoMemoryServer.create({
  binary: { version: "7.0.14" },
});
    console.log("Connecting Mongoose...");
    // await mongoose.connect(mongoServer.getUri(), {
    //   serverSelectionTimeoutMS: 5000,
    // });
    console.log(
      "MongoDB binary:",
      mongoServer.instanceInfo?.instance?.mongodProcess?.spawnfile,
    );

    console.log(
      "MongoDB arguments:",
      mongoServer.instanceInfo?.instance?.mongodProcess?.spawnargs,
    );
    try {
      await mongoose.connect(mongoServer.getUri(), {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      // catch (error) {
      //   console.error("MongoDB connection error:", error);
      //   console.error("Cause:", error.cause);
      //   console.error("Reason:", error.reason);
      //   throw error;
      //   console.error(
      //     "Underlying server error:",
      //     [...(error.reason?.servers?.values() || [])].map(
      //       (server) => server.error,
      //     ),
      //   );
      // }
      console.error("MongoDB connection error:", error.message);

      const servers = error.reason?.servers;

      if (servers) {
        for (const [address, server] of servers) {
          console.error("MongoDB server address:", address);
          console.error("Underlying server error:", server.error);
          console.error("Underlying error message:", server.error?.message);
          console.error("Underlying error code:", server.error?.code);
        }
      }

      throw error;
    }

    console.log("Mongoose connected.");
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  test("should connect to the in-memory database", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
