var physicManager = {
    moveBox: 0,
    update: function (obj) {
        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let res_ts = 2;
        for (let x = newX; x <= newX + obj.size_x && res_ts !== 1; x += obj.size_x / 5) {
            for (let y = newY; y <= newY + obj.size_y && res_ts !== 1; y += obj.size_x / 5) {
                let curr_ts = mapManager.getTilesetIdx(x, y);
                if (curr_ts !== 2) {
                    res_ts = curr_ts;
                }     
            }
        } // определение объектов по новым координатам с более высокой точностью
        if (obj.move_x === 0 && obj.move_y === 0)
            return res_ts;
        if ((obj.name === "fix" || obj.name.indexOf("segf") === 0) && res_ts !== 2) {
            obj.kill();
            return;
        } // объекты атаки не могут проходить черезе стены и находиться на синем экране
        var e = this.entityAtXY(obj, newX, newY);
        if (e !== null) {
            if (obj.name === "player") { // взаимодействие объекта игрока с различными объектами
                if (e.name.indexOf("e") === 0) {
                    e.kill();
                    obj.lifetime -= e.damage;
                    obj.damaged = 1;
                    soundManager.playSound("sounds/hurt.mp3", {looping: false, volume: 0.6});
                } else if (e.name.indexOf("m") === 0) {
                    e.kill();
                    obj.lifetime += e.bonus;
                    soundManager.playSound("sounds/memory.mp3", {looping: false, volume: 0.6});
                } else if (e.name.indexOf("b") === 0) {
                    soundManager.playSound("sounds/hurt.mp3", {looping: false, volume: 0.6});
                    obj.lifetime -= 2;
                    obj.damaged = 1;
                } else if (e.name.indexOf("c") === 0) {
                    soundManager.playSound("sounds/hurt.mp3", {looping: false, volume: 0.6});
                    obj.lifetime -= 3;
                    obj.damaged = 1;
                } else if (e.name === "finish") {
                    gameManager.finish = 1;
                } else if (e.name === "win") {
                    gameManager.win = 1;
                }
            } else if (obj.name === "fix") { // взаимодействие атаки игрока с объектами
                if (e.name.indexOf("b") === 0 || e.name.indexOf("c") === 0 || e.name === "vim") {
                    e.lifetime -= obj.damage;
                }
                obj.kill();
            } else if (obj.name.indexOf("segf") === 0) { // взаимодействие атаки противника с объектами
                if (e.name === "player") {
                    soundManager.playSound("sounds/hurt.mp3", {looping: false, volume: 0.6});
                    e.lifetime -= obj.damage;
                    e.damaged = 1;
                }
                obj.kill();
            }
        }
        if (res_ts !== 1 && e === null) { // перемещаем объект на свободное место
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return res_ts;
        }
        return res_ts;
    },
    playerAtXY : function (x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name === "player") {
                if (x < e.pos_x || y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }
        return null;
    },
    entityAtXY: function (obj, x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x - 10 < e.pos_x || y + obj.size_y - 8 < e.pos_y || x > e.pos_x + e.size_x - 10 || y > e.pos_y + e.size_y - 8)
                    continue;
                return e;
            }
        }
        return null;
    },
}
