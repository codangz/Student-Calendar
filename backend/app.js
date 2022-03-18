const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 5000;

// Assigns the MongoDB Atlas deployment's string with username and password
const uri = "mongodb+srv://codangz:817CFzsA3jrStC8X@codangzcluster.2xscz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);

// Connects to the cloud cluster with MongoDB Atlas client
async function run() {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.error);

var credentials = [];

app.get('/', (req, res) => {
  res.send('Welcome to the student calendar.')
})

app.get('/credentials', (req, res) => {
    var credentialsRecord = {
        'FirstName': req.query.firstName,
        'LastName': req.query.lastName,
        'Age': req.query.age
    };
    credentials.push(credentialsRecord);
    console.log(credentials);
    res.send('Credentials have been added!');
})

app.get('/members', (req, res) => {
  res.send('Team Members: Derek Hoang, Ricardo Garcia, Gaia Dennison, Thongsavik Sirivong')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
