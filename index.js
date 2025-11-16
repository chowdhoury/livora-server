const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to livora server!");
});

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@chowdhoury.6j2rpnl.mongodb.net/?appName=chowdhoury`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("livoraDB");
    const propertiesCollection = database.collection("properties");
    const ratingsCollection = database.collection("ratings");

    // using 
    app.get("/api/properties", async (req, res) => {
      try {
        const sort = req.query.sort;
        const search = req.query.search || "";

        let sortQuery = { createdAt: -1 };

        if (sort === "oldest") {
          sortQuery = { createdAt: 1 };
        } else if (sort === "highest") {
          sortQuery = { costing: -1 };
        } else if (sort === "lowest") {
          sortQuery = { costing: 1 };
        }

        const searchQuery = search
          ? { name: { $regex: search, $options: "i" } }
          : {};

        const properties = await propertiesCollection
          .find(searchQuery, {
            projection: {
              sellerEmail: 0,
              sellerImage: 0,
            },
          })
          .sort(sortQuery)
          .toArray();

        res.send(properties);
      } catch (error) {
        res.status(500).send([]);
      }
    });

    // Using
    app.get("/api/properties/featured", async (req, res) => {
      try {
        const result = await propertiesCollection
          .find(
            {},
            {
              projection: {
                _id: 1,
                category: 1,
                image: 1,
                name: 1,
                location: 1,
                description: 1,
                costing: 1,
              },
            }
          )
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();

        res.send(result);
      } catch (error) {
        res.send([]);
      }
    });



    app.get("/api/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const property = await propertiesCollection.findOne(query);
      const userQuery = { email: property.userEmail };
      res.send(property);
    });

    app.post("/api/properties", async (req, res) => {
      const newProperty = req.body;
      const result = await propertiesCollection.insertOne(newProperty);
      res.send(result);
    });

    app.patch("/api/properties/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };
      const result = await propertiesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/api/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    });

    // Ratings API
    app.get("/api/ratings", async (req, res) => {
      const filter = {};
      if (req.query.email) {
        filter.userEmail = req.query.email;
      }
      // console.log('filter',filter);
      const cursor = ratingsCollection.find(filter);
      const ratings = await cursor.toArray();
      res.send(ratings);
    });

    app.get("/api/ratings/property/:propertyId", async (req, res) => {
      const propertyId = req.params.propertyId;
      const userEmail = req.query.email;

      const query = {
        propertyId: propertyId,
        userEmail: { $ne: userEmail }, // exclude current user's rating
      };

      const ratings = await ratingsCollection.find(query).toArray();
      res.send(ratings);
    });

    app.get("/api/myRatings/property/:propertyId", async (req, res) => {
      const propertyId = req.params.propertyId;
      const userEmail = req.query.email;

      const query = {
        propertyId: propertyId,
        userEmail: userEmail,
      };

      const result = await ratingsCollection.findOne(query);
      res.send(result);
    });

    app.post("/api/ratings", async (req, res) => {
      const newRating = req.body;
      const result = await ratingsCollection.insertOne(newRating);
      res.send(result);
    });

    app.delete("/api/ratings/:propertyId", async (req, res) => {
      // console.log('delete rating called');
      const propertyId = req.params.propertyId;
      const query = { propertyId: propertyId };
      const result = await ratingsCollection.deleteMany(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
