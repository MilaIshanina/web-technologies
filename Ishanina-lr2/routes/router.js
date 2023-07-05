let express = require('express');//подключение библиотек
let body_parser = require('body-parser');
let router = express.Router();//создаем обработчик запросов
let session = require('express-session');//для сохранения сообщений до закр. вкладки
router.use(body_parser.json());
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

let book_json = require('../public/json/lib')//подключение данных о книге


router.get('/', (req, res, next) => {
    res.render('index', {title: 'Библиотека'});
});//отображение стартовой стр когда обращаемся по localhost

router.get('/library', (req, res, next) => {
    if (req.session.msg) {
        let message = req.session.msg
        req.session.msg = null;
        res.render('library', {title: 'Библиотека', books: book_json, if_msg: true, msg: message});
    } else {
        res.render('library', {title: 'Библиотека', books: book_json, if_msg: false});
    }
});//получение страницы Библиотека


router.get('/book/:num', (req, res, next) => {
    const id = req.params.num;

    if (id === 'all_books') {
        let all_array = [];
        for (let value of book_json)
            all_array.push(value.id)
        res.end(JSON.stringify(all_array));
        return;
    }
    if (id === 'in_lib') {
        let unvis = [];
        let vis = [];
        book_json.forEach((v, i) => {
            if (v.in_library === "нет")
                unvis.push(v.id)
            else
                vis.push(v.id)
        });
        res.end(JSON.stringify({unvis: unvis, vis: vis}));
        return;
    }
    if (id === 'date_return') {
        let unvis = [];
        let vis = [];
        let cur_date = new Date();
        book_json.forEach((v, i) => {
            let v_date = new Date(v.date_return + 'T23:59:59.999Z')
            if (v_date > cur_date || v.in_library === "да") {
                unvis.push(v.id);
            } else {
                vis.push(v.id)
            }

        });
        res.end(JSON.stringify({unvis: unvis, vis: vis}));
        return;
    }

    for (let value of book_json) {
        if (value.id == id) {
            res.render('book', {
                title: 'Книга', ID: `${value.id}`, name: `${value.name}`,
                author: `${value.author}`, date: `${value.date}`, in_library: `${value.in_library}`,
                person: `${value.person}`, date_return: `${value.date_return}`
            });
            return;
        }
    }
});//запрос на конкретную книгу


router.post('/book/:num', (req, res, next) => {
    let id = req.params.num;
    book_json.forEach((v, i) => {
        if (v.id == id) {
            book_json.splice(i, 1);
            req.session.msg = "Книга удалена";
            res.redirect('/library');
            //res.render('message', {title: 'library', msg: 'Книга успешно удалена'});
        }
    });
});//запрос на удаление книги

router.post('/new', (req, res, next) => {
    for (let value of book_json) {
        if (value.id == req.body.id) {
            res.redirect('/library');
            //res.render('message', {title: 'library', msg: 'Книга с таким id уже существует'});
            return;
        }
    }

    book_json.push({
        "id": req.body.id,
        "name": req.body.name,
        "author": req.body.author,
        "date": req.body.date,
        "in_library": "да",
        "person": "-",
        "date_return": "-"
    });
    req.session.msg = "Книга успешно добавлена";
    res.redirect('/library');
    //res.render('message', {title: 'library', msg: 'Книга успешно добавлена'})
});//запрос на добавление книги

router.post('/book/read/:num', (req, res, next) => {
    let date = new Date( req.body.date+ 'T23:59:59.999Z');
    if(date < new Date()){
        req.session.msg = "Дата возврата меньше текущей";
        res.redirect('/library');
        return;
    }
    let id = req.params.num;
    for (let value of book_json) {
        if (value.id == id) {
            value.person = req.body.name;
            value.date_return = req.body.date;
            value.in_library = "нет";
        }
    }
    req.session.msg = "Читатель добавлен";
    res.redirect('/library');
    //res.render('message',{title: 'library', msg:'Читатель добавлен'});
});//запрос на взятие книги

router.post('/book/back/:num', (req, res, next) => {
    let id = req.params.num;
    for (let value of book_json)
        if (value.id == id) {
            value.person = "-";
            value.date_return = "-";
            value.in_library = "да"
        }
    req.session.msg = "Книга успешно возвращена";
    res.redirect('/library');
    //res.render('message', {title: 'library', msg: 'Книга успешно возвращена'});
});

router.post('/book/edit/:num', (req, res, next) => {
    let id = req.params.num;
    for (let value of book_json)
        if (value.id == id) {
            if (req.body.name)
                value.name = req.body.name;
            if (req.body.author)
                value.author = req.body.author;
            if (req.body.date)
                value.date = req.body.date;
        }
    req.session.msg = "Изменения успешно внесены";
    res.redirect('/library');
    //res.render('message', {title: 'library', msg: 'Изменения успешно внесены'});

});


router.get("*", (req, res) => {
    res.status(404);
    res.end("Page not found")
})//обработка неверного адреса
module.exports = router;//указываем какой объект будет экспортироваться