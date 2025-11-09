const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to livora server!')
})

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
    } finally {
        
    }
}

run().catch(console.dir)




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
})