var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");


var gameManager = {
    factory: {},
    entities: [],
    player: null,
    levels_path: ["./maps/progwar_l1.json", "./maps/progwar_l2.json"],
    level: 0,
    segIndex: 0,
    finish: 0,
    score: 0,
    win: 0,

    initPlayer: function (obj) {
        this.player = obj;
    },

    update: function () {
        if (this.player === null)
            return;
        this.player.move_x = 0;
        this.player.move_y = 0;
        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]) this.player.move_x = 1;
        if (eventsManager.action["esc"]) this.endGame(4);
        if (eventsManager.action["space"]) this.player.fire();

        this.entities.forEach(function (e) {
            try {
                e.update();
            } catch (ex) {
                console.log(e.name + " " + ex);
            }
        });

        mapManager.updateHealth(this.player);

        if (this.player.lifetime <= 0) {
            this.player.lifetime = 0;
            mapManager.updateHealth(this.player);
            this.score = 0;
            this.endGame(1);
            return;
        }
        mapManager.draw(ctx);
        this.draw(ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        if (this.finish) {
            this.finish = 0;
            gameManager.nextLevel();
        } else if (this.win) {
            this.win = 0;
            this.endGame(3);
        }
    },
    draw: function (ctx) {
        for (var e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx)
    },
    loadAll: function () {
        mapManager.loadMap(this.levels_path[this.level]);
        spriteManager.loadAtlas("./sprites/sprites.json", "./sprites/spritesheet.png");
        gameManager.factory['Player'] = Player;
        gameManager.factory['Bug'] = Bug;
        gameManager.factory['Error'] = Error;
        gameManager.factory['Memory'] = Memory;
        gameManager.factory['Crash'] = Crash;
        gameManager.factory['Vim'] = Vim;
        gameManager.factory['Fix'] = Fix;
        mapManager.parseEntities();
        mapManager.draw(ctx);
        eventsManager.setup(canvas);
        soundManager.stopAll();
        soundManager.init();
        soundManager.loadArray(["sounds/bg.mp3", "sounds/attack.mp3", "sounds/segf.mp3", "sounds/memory.mp3", "sounds/sad.mp3", "sounds/hurt.mp3"]);
        //soundManager.playSound("sounds/bg.mp3", { looping: true, volume: 0.6 });
        this.loadRecords();
    },
    nextLevel: function () {
        gameManager.endGame(2);
        gameManager.loadAll();
        gameManager.play();
    },
    play: function () {
        if (this.interval)
            clearInterval(this.interval);
        this.interval = setInterval(updateWorld, 50);
    },
    reload: function () {
        if (eventsManager.action["enter"]) {
            clearInterval(this.interval);
            gameManager.loadAll();
            gameManager.play();
        }
    },
    endGame: function (type) {
        clearInterval(this.interval);
        mapManager.reset();
        spriteManager.reset();
        gameManager.entities = [];
        soundManager.stopAll();
        if (type === 1) {
            soundManager.init();
            soundManager.loadArray(["sounds/sad.mp3"]);
            soundManager.playSound("sounds/sad.mp3");
        }
        this.factory = {};
        this.entities = [];
        if (type === 2) {
            this.score = this.player.lifetime;
        } else {
            this.score = 0;
        }
        this.levels_path = ["./maps/progwar_l1.json", "./maps/progwar_l2.json"];
        this.level = type === 1 || type === 3 || type === 4 ? 0 : 1;
        if (type === 1 || type === 3 || type === 4) {
            ctx.clearRect(0, 0, mapManager.view.w, mapManager.view.h);
            if (type === 1)
                text = "Вы потеряли все здоровье и проиграли. Нажмите Enter, чтобы начать заново.";
            else if (type === 3) {
                text = "Поздравляем с победой, " + player + "! Вы сохранили " + this.player.lifetime + " здоровья.";
                this.updateRecords();
            }
            else if (type === 4)
                text = "Нажмите Enter, чтобы начать заново.";
            ctx.font = "24px Comfortaa";
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillText(text, 10, mapManager.view.h / 2);
            this.interval = setInterval(this.reload, 100);
        }
        this.player = null;
    },
    updateRecords: function () {
        let arr;
        if (localStorage.hasOwnProperty('hightscores')) {
            arr = JSON.parse(localStorage.getItem('hightscores'));
            let was = false;
            for (let p of arr) {
                if (p.name === player) {
                    was = true;
                    if (p.score < this.player.lifetime) {
                        p.score = this.player.lifetime;
                    }
                }
            }
            if (was === false) {
                arr.push({ name: player, score: this.player.lifetime });
            }
            arr.sort(function (a, b) {
                return b.score - a.score;
            });
            while (arr.length > 10) {
                arr.pop();
            }
            localStorage.setItem('hightscores', JSON.stringify(arr));
        } else {
            arr = [];
            arr.push({ name: player, score: this.player.lifetime });
            localStorage.setItem('hightscores', JSON.stringify(arr));
        }
    },
    loadRecords: function () {
        if (localStorage.hasOwnProperty('hightscores')) {
            arr = JSON.parse(localStorage.getItem('hightscores'));
            var table = '<table class="table-sm">';
            table += '<tr><th>#</th><th>Имя</th><th>Здоровье</th></tr>';
            for (var i = 0; i < arr.length; i++) {
                table += '<tr>';
                table += '<td>' + (Number(i) + 1) + '</td>';
                table += '<td>' + arr[i].name + '</td>';
                table += '<td>' + arr[i].score + '</td>';
                table += '</tr>';
            }
            table += '</table>';
            document.getElementById('table').innerHTML = table;
        }
    }
};

function updateWorld() {
    gameManager.update()
}

gameManager.loadAll();
gameManager.play();
