const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbConfig = require('./config/db.js');
const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To handle JSON body payloads

// MongoDB connection URI
const client = new MongoClient(dbConfig.url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Get the database instance
    const database = client.db('myDatabase'); // Replace with your database name

    // Pass the database to the routes
    require('./app/routes')(app, database);

    // Start the server
    app.listen(port, () => {
      console.log("We are live on port " + port);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB or starting the server:", err);
    process.exit(1); // Exit the process with an error
  }
}

// Start the app
run().catch(console.dir);
