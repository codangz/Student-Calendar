const express = require('express')
const app = express()
const port = 3000

var credentials = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/demo', (req, res) => {
  res.send('This is a nodejs demo!')
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
