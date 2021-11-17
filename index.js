const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

// Middleware
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlpea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("glassGhor");
    const latestCollections = database.collection("latestCollection");
    const glassesCollections = database.collection("glassesCollection");

    // Get All latestGlasses for home page
    app.get("/latestCollection", async (req, res) => {
      const cursor = latestCollections.find({});
      const latestCollection = await cursor.toArray();
      res.send(latestCollection);
    });
    // Get All Glasses
    app.get("/glassesCollection", async (req, res) => {
      const cursor = glassesCollections.find({});
      const glassesCollection = await cursor.toArray();
      res.send(glassesCollection);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// ============================================ //

app.get("/", (req, res) => {
  res.send("GlassGhor Server is Running");
});

app.listen(port, () => {
  console.log(`App Listening on: ${port}`);
});
