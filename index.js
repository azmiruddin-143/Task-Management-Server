require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

// mongodb start //

const uri = `mongodb+srv://${process.env.TASK_USER}:${process.env.TASK_PASS}@cluster0.8luat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("TaskManager");
    const usersCollection = database.collection("users");

    app.post('/users', async (req, res) => {
      const usersBody = req.body
      // new up
      const query = { userEmail: usersBody.userEmail }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      // new up
      const result = await usersCollection.insertOne(usersBody)
      res.send(result)
    })


    // await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send("Task Management ...")
})

app.listen(port, () => {
  console.log("Server Runnig", port);
})
