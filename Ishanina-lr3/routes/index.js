let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');

let paintings = require('../public/jsons/paintings.json')
let users = require('../public/jsons/users.json')
let settings = require('../public/jsons/settings.json')

/* GET home page. */
router.get('/', (req, res) => {
    res.render('main', {title:'Выставка картин', artwork:paintings});
});

router.get('/main', (req, res) => {
    res.render('main', {title:'Выставка картин', artwork:paintings});
});

router.get('/users', (req, res) => {
    res.render('users', {title:'Участники аукциона', users:users});
})

router.get('/settings', (req, res) => {
    res.render('settings', {title:'Настройки', settings:settings});
})

router.post('/card/add', (req, res) => {
    paintings.push({
        "id":paintings.length + 1,
        "name":req.body.name,
        "author":req.body.author,
        "price":req.body.price,
        "src":req.body.src,
        "max":req.body.max,
        "min":req.body.min
    })
    res.redirect('/main');
})

router.post('/user/add', (req, res) => {
    users.push({
        "id":users.length + 1,
        "nickname":req.body.nickname,
        "name":req.body.name,
        "surname":req.body.surname,
        "balance":req.body.balance,
        "avatar":req.body.avatar
    })
    res.redirect('/users');
})

router.post('/card/delete/:num', (req, res) => {
    let index = 0
    let num = req.params.num
    for (let card of paintings) {
        if (card.id === parseInt(num)) {
            paintings.splice(index, 1)
            res.redirect('/main')
        }
        index++
    }
    res.redirect('/main')
})

router.post('/user/delete/:num', (req, res) => {
    let index = 0
    let num = req.params.num
    for (let user of users) {
        if (user.id === parseInt(num)) {
            users.splice(index, 1)
            res.redirect('/users')
        }
        index++
    }
    res.redirect('/users')
})

router.post('/card/edit/:num', (req, res) => {
    let num = req.params.num
    for (let card of paintings) {
        if (card.id === parseInt(num)) {
            card.name = req.body.ename
            card.author = req.body.eauthor
            if(req.body.eprice > 0)
                card.price = req.body.eprice
            card.min = req.body.emin
            card.max = req.body.emax
        }
    }
    res.redirect('/main')
})

router.post('/user/edit/:num', (req, res) => {
    let num = req.params.num
    for (let user of users) {
        if (user.id === parseInt(num)) {
            user.nickname = req.body.enickname
            user.avatar = req.body.eavatar
            user.name = req.body.ename
            user.surname = req.body.esurname
            user.balance = req.body.ebalance
        }
    }
    res.redirect('/users')
})

router.post('/settings/edit', (req, res) => {
    settings.date = req.body.date
    settings.time = req.body.time
    settings.timeout = req.body.timeout
    settings.duration = req.body.duration
    settings.info_timeout = req.body.info_timeout
    fs.readFile(path.join(__dirname, '..', 'public', 'jsons', 'settings.json'), function (err, content) {
        if (err)
            throw err;
        let parseJson = JSON.parse(content);
        parseJson.date = settings.date
        parseJson.time = settings.time
        parseJson.timeout = settings.timeout;
        parseJson.duration = settings.duration;
        parseJson.info_timeout = settings.info_timeout;
        fs.writeFile(path.join(__dirname, '..', 'public', 'jsons', 'settings.json'), JSON.stringify(parseJson), function (err) {
            if (err) throw err;
        })
    });
    res.redirect('/settings')
})

module.exports = router;
