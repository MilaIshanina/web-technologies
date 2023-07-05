//главный файл, в котором настраивается и запускается приложение
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let lessMiddleware = require('less-middleware');
let logger = require('morgan');

let fs = require('fs');//библиотека для считывания из файла и сохранения в файл
let http = require('http');
let https = require('https');
let privateKey  = fs.readFileSync('ssl/example.key', 'utf8');
let certificate = fs.readFileSync('ssl/example.csr', 'utf8');
let credentials = {key: privateKey, cert: certificate};

let indexRouter = require('./routes/index');

let app = express();//создание сервера

// view engine setup
app.set('views', path.join(__dirname, 'views'));//1 аргумент - какой параметр устанавливаем
// 2 аргумент - значение параметра
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));//для расшифровки запросов
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
module.exports = app;
