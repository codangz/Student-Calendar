import chalk from 'chalk';
import express from 'express';
const app = express();
const port = 3000;

var credentials = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/demo', (req, res) => {
  res.send('This is a nodejs demo!')
})

app.get('/terminal', (req, res) => {
  console.log(chalk.blue('Diverse Terminal Text Styles'));
  console.log(chalk.magenta('Magneta Text!'));
  console.log(chalk.red('ERROR!'));
  console.log(chalk.underline('I am underlined!'));
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

app.get('/practice', (req, res) => {
    res.send('This is practice!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
