var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var router = require('./routes/router')

var users = require('./public/json/person');
var arts = require('./public/json/paint');
var setting = require('./public/json/setting');

let fs = require('fs');//библиотека для считывания из файла и сохранения в файл
let https = require('https');
let privateKey  = fs.readFileSync('ssl/example.key', 'utf8');
let certificate = fs.readFileSync('ssl/example.csr', 'utf8');
let credentials = {key: privateKey, cert: certificate};


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);




//app.set('port',3000);
let server = https.createServer(credentials, app);



var io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.on('hello', function(data) {
        socket.broadcast.json.emit('welcome', { message: `${data.name} присоединился к чату`, setting:setting, arts: arts, users:users});
        socket.json.emit('welcome', { message: `${data.name} присоединился к чату`, setting:setting, arts: arts, users:users});
    });
    socket.on('make_bet', function(data) {

        let bet = Number(data.bet)
        for(let usr of users) {
            if(usr.name === data.user) {
                var money = Number(usr.money)
                break;
            }
        }

        let min = Number(arts[data.art].price) + Number(arts[data.art].min);
        let max = Number(arts[data.art].price) + Number(arts[data.art].max);
        if((bet < min) || (bet > max)){
            //$('#msg_field').append("<p>" + 'Невозможно назначить такую цену');
            socket.broadcast.json.emit('mail_bet', { message: `нельзя назначить такую цену: ${data.bet}`});
            socket.json.emit('mail_bet', { message: `нельзя назначить такую цену: ${data.bet}`});
            bet = 0;
            //set_zero_bet()
            return;
        }
        if(bet > money ) {

            //$('#msg_field').append("<p>" + 'Недостаточно средств');
            socket.broadcast.json.emit('mail_bet', { message: `недостаточно средств`});
            socket.json.emit('mail_bet', { message: `недостаточно средств`});
            bet = 0;
            //set_zero_bet()
            return;
        }

        socket.broadcast.json.emit('mail_bet', { message: `${data.name} сделал ставку ${data.bet}`});
        socket.json.emit('mail_bet', { message: `${data.name} сделал ставку ${data.bet}`});

        arts[data.art].price = data.bet;
        socket.broadcast.json.emit('update', {users:users, arts: arts, message:""});
        socket.json.emit('update', {users:users, arts: arts, message:""});
    });
    socket.on('admin_start', function (data) {
        socket.broadcast.json.emit('start', { message: 'Аукцион открыт!', setting:setting, arts: arts});
        socket.json.emit('start', { message: 'Аукцион открыт!', setting:setting, arts: arts});
    });
    socket.on('buy', function (data) {
        if(arts[data.art].buyer === "-") {
            for(let user of users) {
                if(user.name === data.name) {
                    user.money = String(Number(user.money) - Number(data.price));
                }
            }
            arts[data.art].buyer = data.name;
            arts[data.art].final_price = data.price;
            socket.broadcast.json.emit('update', {users:users, arts: arts, message:`${data.name} приобрел картину ${arts[data.art].name}`});
            socket.json.emit('update', {users:users, arts: arts, message:`${data.name} приобрел картину ${arts[data.art].name}`});
        }
    });
});

//let httpsServer = https.createServer(credentials, app);

server.listen(8443);

//server.listen(3000);
