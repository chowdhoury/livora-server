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
    const userCollection = database.collection("users");
    const propertiesCollection = database.collection("properties");
    const ratingsCollection = database.collection("ratings");

    app.get("/api/users", async (req, res) => {
      const query = {};
      if (req.query.email) {
        query.email = req.query.email;
      }
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/api/users",  async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });



    // Properties API
    app.get("/api/properties", async (req, res) => {
      const query = {};
      if (req.query.email) {
        query.userEmail = req.query.email;
      }
      const cursor = propertiesCollection.find(query).sort({ createdAt: -1 });
      const properties = await cursor.toArray();
      res.send(properties);
    });


    app.get("/api/properties/featured", async (req, res) => {
      const query = {};
      const cursor = propertiesCollection.find(query).sort({ createdAt: -1 }).limit(6);
      const properties = await cursor.toArray();
      res.send(properties);
    });

    app.get("/api/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const property = await propertiesCollection.findOne(query);
      const userQuery = { email: property.userEmail };
      const user = await userCollection.findOne(userQuery);
      property.userName = user?.name || "Unknown";
      property.userPhoto = user?.photoURL || "";
      
      // console.log('ok',property.userPhoto);
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
      if(req.query.email){
        filter.reviewerEmail = req.query.email;
      }
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


  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
