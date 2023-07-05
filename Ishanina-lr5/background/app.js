var app = require('express')();
var path = require('path');
var bodyParser = require('body-parser');
const server = require('http').createServer(app);
const cors = require('cors');

const corsOptions = {
  'credentials': true,
  'origin': true,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', require('./routes/routes'));

port = 4201;
server.listen(port);
