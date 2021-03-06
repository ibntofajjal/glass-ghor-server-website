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

    // Database Collections
    const latestCollections = database.collection("latestCollection");
    const glassesCollections = database.collection("glassesCollection");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");
    const messagesCollection = database.collection("messages");

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

    // Get Single Product for order [latestCollections]
    app.get("/singleProduct/:id", async (req, res) => {
      const result = await latestCollections
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });

    // Get Single Product for order [glassesCollections]
    app.get("/singleProduct/:id", async (req, res) => {
      const result = await glassesCollections
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });

    // Post the Order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(order);
      res.json(result);
    });

    // Get the All Orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // Delete  Orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // Post Review
    app.post("/addReview", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      res.send(result);
    });

    // Get  All Review
    app.get("/addReview", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
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
