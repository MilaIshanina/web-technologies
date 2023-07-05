var socket = io();

var current_timer;
var info_timer;
var torg_timer;
var save_info;
var save_torg;
var cur_art = -1;
var arts;
var cur_user;
var bet = 0;

socket.on('connect',function(){
    var text = $('#big').text();
    socket.emit('hello', {name:text});
});

socket.on('welcome', function(data) {
    var text = "<p>" + data.message;
    $('#msg_field').append(text);
    update_info(data);
    $('#send_btn').attr('disabled', true);
});

socket.on('mail_bet', function(data) {
    var text = "<p>" + data.message;
    $('#msg_field').append(text);
    console.log(arts[cur_art].price);
});

socket.on('start', function(data) {
    var text = $('#big').text();
    $('#msg_field').append("<p>"+ data.message+"</p>");
    current_timer = data.setting.tm_end;
    info_timer = data.setting.tm_info;
    torg_timer = data.setting.tm_torg;
    save_info = data.setting.tm_info;
    save_torg = data.setting.tm_torg;
    get_new_art();
    setTimeout(current_time, 1000);
    setTimeout(info_time, 1000);
});

socket.on('update', function(data) {
    update_info(data);
    $('#msgField').append(data.message);
});

function start_auction() {
    socket.emit('admin_start');
    $('#open_auc').attr('disabled', true);
}

function get_new_art(){
    cur_art++;
    var art = arts[cur_art];
    $('#msg_field').append("<p> " + art.name);
    if ($('#big').text() !== "Admin") {
        $("#art_window").empty();
        $("#art_window").append("<p> Текущая картина:")
        $('#art_window').append("<table id='cur_art_table'>" );
        $("#cur_art_table").append(`<th> <img src=${art.pt} width = 100> </th>`);
        $("#cur_art_table").append("<th id='cur_art_info'>");
        $("#cur_art_info").append("Название: " + art.name);
        $("#cur_art_info").append("<p> Художник: " + art.artist);
        $("#cur_art_info").append("<p> Стартовая цена: " + art.price);
        $("#cur_art_info").append("<p> Ставка от " + art.min + " до " + art.max);
    }
}


function update_info(data) {
    let title = $('#big').text();
    arts = data.arts;
    for(let usr of data.users) {
        if(usr.name === $('#big').text()) {
            cur_user = usr;
        }
    }
    if (title === "Admin") {
        $("#users_window").empty();
        $('#paint_window').empty();
        for (let item of data.users) {
            $('#users_window').append("<p> Имя участника: " + item.name);
            $('#users_window').append("<p> Запас денежных средств: " + item.money);
            $('#users_window').append("<hr>");
        }
        for (let item of data.arts) {
            $('#paint_window').append(`<table id='art_table${item.id}'>` );
            $(`#art_table${item.id}`).append(`<th> <img src=${item.pt} width = 100> </th>`);
            $(`#art_table${item.id}`).append(`<th id='art_info${item.id}'>`);
            $(`#art_info${item.id}`).append("Название: " + item.name);
            $(`#art_info${item.id}`).append("<p> Художник: " + item.artist);
            $(`#art_info${item.id}`).append("<p> Текущая цена: " + item.price);
            $(`#art_info${item.id}`).append("<p> Покупатель: " + item.buyer);
            $(`#art_info${item.id}`).append("<p> Продано за: " + item.final_price);
            $(`#art_info${item.id}`).append("<hr></th>");
        }
    } else {
        $('#info_window').empty();
        for (let item of data.users) {
            if(item.name == title) {
                $('#info_window').append("<p> Имя участника: " + item.name);
                $('#info_window').append("<p> Запас денежных средств: " + item.money + "<p>");
            }
        }
    }
}

function torg_time() {
    if(current_timer === 0) {
        return;
    }
    if($('#big').text() !== "Admin") {
        $('#send_btn').attr('disabled', false);
    }
    torg_timer -= 1;
    $('#local_time').empty();
    $('#local_time').append(`До конца торга по картине: ${torg_timer}`);
    if(torg_timer > 0) {
        setTimeout(torg_time, 1000);
    } else {
        torg_timer = save_torg;
        info_timer = save_info;
        let text = $('#big').text();
        console.log(bet + "--" +arts[cur_art].price);
        if(Number(bet) >= Number(arts[cur_art].price)) {
            socket.emit('buy', {name: cur_user.name, price: bet, art: cur_art});
            $('#buy_window').append(`<table id='buy_table${arts[cur_art].id}'>` );
            $(`#buy_table${arts[cur_art].id}`).append(`<th> <img src=${arts[cur_art].pt} width = 100> </th>`).css('font-size', '10pt');
            $(`#buy_table${arts[cur_art].id}`).append(`<th id='buy_info${arts[cur_art].id}'>`);
            $(`#buy_info${arts[cur_art].id}`).append(`<p id='b_name${arts[cur_art].id}'>Название: ` + arts[cur_art].name);
            $(`#buy_info${arts[cur_art].id}`).append(`<p id='b_artist${arts[cur_art].id}'> Художник: ` + arts[cur_art].artist);
            $(`#buy_info${arts[cur_art].id}`).append(`<p id='b_line${arts[cur_art].id}'> <hr></th>`);
            $(`#b_name${arts[cur_art].id}`).css('font-size', '10pt');
            $(`#b_artist${arts[cur_art].id}`).css('font-size', '10pt');
            $(`#b_line${arts[cur_art].id}`).css('font-size', '10pt');
            bet = 0;
        }
        get_new_art();
        setTimeout(info_time, 1000);
    }
}

function info_time() {
    if(current_timer === 0) {
        return;
    }
    $('#send_btn').attr('disabled', true);
    info_timer -= 1;
    $('#local_time').empty();
    $('#local_time').append(`До конца изучения информации по картине: ${info_timer}`);
    if(info_timer > 0) {
        setTimeout(info_time, 1000);
    } else {
        setTimeout(torg_time, 1000);
    }
}

function current_time() {
    current_timer -= 1;
    $('#current_time').empty();
    $('#current_time').append(`До конца аукциона: ${current_timer}`);
    if(current_timer > 0) {
        setTimeout(current_time, 1000);
    } else {
        $('#send_btn').attr('disabled', true);
        $('#msg_field').append('<p> Аукцион закончен.');
        $('#open_auc').attr('disabled',false);
    }
}

function make_bet() {
    bet = $('#send_input').val();
    // let min = Number(arts[cur_art].price) + Number(arts[cur_art].min);
    // let max = Number(arts[cur_art].price) + Number(arts[cur_art].max);
    // if((Number(bet) < min) || (Number(bet) > max)){
    //     $('#msg_field').append("<p>" + 'Невозможно назначить такую цену');
    //     bet = 0;
    //     return;
    // }
    if(Number(bet) > Number(cur_user.money)) {
         $('#msg_field').append("<p>" + 'Недостаточно средств');
         bet = 0;
         return;
     }

    var text = $('#big').text();
    socket.emit('make_bet', {name:text,user: cur_user ,bet:bet, art:cur_art});
}

function set_zero_bet() {
    bet = 0;
}
