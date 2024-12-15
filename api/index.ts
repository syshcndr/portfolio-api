const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();

// Use the environment variable PORT if it exists, otherwise default to 3000
const port = process.env.PORT || 3000; 

const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;

// Connect to MongoDB (Cosmos DB)
mongoose.connect(cosmosDbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Azure Cosmos DB');
  })
  .catch((err) => {
    console.error('Error connecting to Cosmos DB', err);
  });

// Middleware to parse JSON requests
app.use(express.json());

// Route to fetch all collections in the 'portfolio' database
app.get('/', (req, res) => {
  res.send('Hello from Express and Cosmos DB!');
});
  
app.get('/portfolio', async (req, res) => {
    try {
      // Create a MongoClient instance
      const client = new MongoClient(cosmosDbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      // Connect to the MongoDB client
      await client.connect();
  
      // Access the 'portfolio' database
      const db = client.db('portfolio');
  
      // Access the 'resume' collection
      const collection = db.collection('resume');
  
      // Fetch all documents from the 'resume' collection
      const documents = await collection.find({}).toArray();
  
      // Close the client connection
      await client.close();
  
      // Send the documents as a JSON response
      res.status(200).json(documents[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching documents from the resume collection', error: err.message });
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});