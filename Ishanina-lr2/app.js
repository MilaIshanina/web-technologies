let express = require('express');
let app = express();
let path = require('path');
let router = require('./routes/router');
let cookieParser = require('cookie-parser');
let body_parser = require('body-parser');
let session = require('express-session');
let https = require('https');
let fs = require('fs');

let key = fs.readFileSync('ssl/example.key');
let cert = fs.readFileSync('ssl/example.csr');
let cred = {key: key, cert: cert};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/',router);
let server = https.createServer(cred, app);
server.listen(8443);
module.exports =app;



