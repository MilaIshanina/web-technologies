const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
router.use(bodyParser.json());
const users = require('../public/json/person');

var current_user = "";

router.get('/', function(req,res,next) {
    res.render('index', {title:'Аукцион'});
});

router.post('/in',function (req,res,next) {
   const name = req.body.name;
   if (name == 'admin'){
       res.redirect('./admin');
       return;
   }

   for(let val of users){
       if(val.name == name){
           current_user = name;
           res.redirect('./user');
           return;
       }
   }
   res.end('No user with this name !!!')
});

router.get('/admin',function (req,res,next) {
   res.render('admin', {title:'Admin'});
});
router.get('/user', function(req,res,next) {
    res.render('user', {title: current_user});
});
module.exports = router;
