const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 3000;

// middleware added
app.use(express.json());
app.use(cors());

// mongoDb connection

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@chat-application.qhq6ecs.mongodb.net/?appName=chat-application`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const DB = client.db("zap_Shift");
    const parcelsCollection = DB.collection("parcelsCollection");

    // parcels api
    app.get("/parcels", async (req, res) => {
      const query = {};
      const { email } = req.query;
      // /parcels?email=''&
      if (email) {
        query.senderEmail = email;
      }

      const options = { sort: { createdAt: -1 } };

      const cursor = parcelsCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/parcels", async (req, res) => {
      const parcelsData = req.body;
      // parcels created time
      parcelsData.createdAt = new Date();

      app.delete("/parcels/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const result = await parcelsCollection.deleteOne(query);
        res.send(result);
      });

      const result = await parcelsCollection.insertOne(parcelsData);
      res.status(200).send({ Message: "data added", result });
    });
  } finally {
  }
}
run();

app.get("/", (req, res) => {
  res.send("Zap_shift server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
