import { compareAsc, format } from 'date-fns'
import chalk from 'chalk';
import express from 'express';
import { MongoClient } from 'mongodb'
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

app.get('/underscore', (req, res) => {
    res.send('Range of 1 - 10 sent to console!');
    console.log(_.range(10));
})

app.get('/members', (req, res) => {
  res.send('Team Members: Derek Hoang, Ricardo Garcia, Gaia Dennison, Thongsavik Sirivong')
})

app.get('/dateDemo', (req, res) => {
  format(new Date(2014, 1, 11), 'yyyy-MM-dd')

  const dates = [
    new Date(1995, 6, 2),
    new Date(1987, 1, 11),
    new Date(1989, 6, 10),
  ]
  dates.sort(compareAsc)

  res.send(dates)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
