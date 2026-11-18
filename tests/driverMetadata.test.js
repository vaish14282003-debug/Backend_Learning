
const { MongoClient } = require("mongodb");

test("inspect MongoDB metadata generation error", async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017", {
    runtimeAdapters: { os: require("os") },
  });

  try {
    console.log("Node:", process.version);
    console.log("MongoDB driver:", require("mongodb/package.json").version);

    const metadata = await client.options.metadata;
    console.log("Generated metadata:", JSON.stringify(metadata, null, 2));

    const {
      makeClientMetadata,
    } = require("mongodb/lib/cmap/handshake/client_metadata");

    try {
      const result = await makeClientMetadata([], client.options);
      console.log("Direct metadata result:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("DIRECT METADATA ERROR:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }

    expect(metadata.driver).toBeDefined();
  } finally {
    await client.close();
  }
});
