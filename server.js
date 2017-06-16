const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routes');
//const users = require('./routes/users')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// use bodyParser() to access POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// and methodOverride to be able to send PUT and DELETE verbs
const methodOverride = require('./lib/method-override');

app.use(methodOverride);

app.use('/', routes);
//app.use('/users', users);


app.use('*',function(req, res){
  res.status(404).send('Page Not Found!');
});

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
  console.log('listening on ' + PORT)
})

module.exports = app;