function randMove(obj) {
    let rand = Math.random();
    obj.move_x = 0;
    obj.move_y = 0;
    if (rand <= 0.15) {
        obj.move_x = 1;
        obj.move_y = 0;
        obj.rotation = 90;
    } else if (rand <= 0.3) {
        obj.move_x = 0;
        obj.move_y = -1;
        obj.rotation = 0;
    } else if (rand <= 0.45) {
        obj.move_x = 0;
        obj.move_y = 1;
        obj.rotation = 180;
    } else if (rand <= 0.6) {
        obj.move_x = -1;
        obj.move_y = 0;
        obj.rotation = 270;
    }
}

var Entity = {
    pos_x: 0,
    pos_y: 0,
    size_x: 0,
    size_y: 0,
    kill: function () {
        for (var i = 0; i < gameManager.entities.length; i++) {
            if (gameManager.entities[i].name === this.name) {
                gameManager.entities.splice(i, 1);
                break;
            }
        }
    },
    extend: function (extendProto) { // позволяет устанавливать любые новые свойства для объекта
        var object = Object.create(this);
        for (var property in extendProto) {
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    },
}

var Player = Entity.extend({
    lifetime: 128,
    move_x: 0,
    move_y: 0,
    speed: 4,
    rotation: 0,
    damaged: 0,
    reload: 0,
    name: "player",
    draw: function (ctx) {
        let sprite_name = "clang";
        if (this.damaged > 0) {
            this.damaged += 1;
            if (this.damaged % 2 === 0)
                sprite_name = "clang_d";
            if (this.damaged === 8)
                this.damaged = 0;
        }
        switch (this.rotation) {
            case 90: sprite_name += "_t"; break;
            case 180: sprite_name += "_b"; break;
            case 270: sprite_name += "_l"; break;
        }
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
        if (this.move_x === -1) {
            this.rotation = 270;
        }
        if (this.move_x === 1) {
            this.rotation = 0;
        }
        if (this.move_y === -1) {
            this.rotation = 90;
        }
        if (this.move_y === 1) {
            this.rotation = 180;
        }
        if (physicManager.update(this) === 3) {
            soundManager.playSound("sounds/hurt.mp3", {looping: false, volume: 0.6});
            this.lifetime -= 1;
            this.damaged = 1;
        }
        if (this.reload > 0) {
            this.reload -= 1;
        }
        return;
    },
    fire: function () {
        if (this.reload === 0) {
            var r = Object.create(Fix);
            r.size_x = 28;
            r.size_y = 28;
            r.name = "fix";
            r.move_x = 0;
            r.move_y = 0;
            switch (this.rotation) {
                case 0:
                    r.pos_x = this.pos_x + this.size_x - 10;
                    r.pos_y = this.pos_y;
                    r.move_x = 1;
                    break;
                case 180:
                    r.pos_y = this.pos_y + this.size_y - 10;
                    r.pos_x = this.pos_x;
                    r.move_y = 1;
                    break;
                case 270:
                    r.pos_x = this.pos_x - r.size_x + 10;
                    r.pos_y = this.pos_y;
                    r.move_x = -1;
                    break;
                case 90:
                    r.pos_y = this.pos_y - r.size_y + 10;
                    r.pos_x = this.pos_x;
                    r.move_y = -1;
                    break;
            }
            gameManager.entities.push(r);
            soundManager.playSound("sounds/attack.mp3", {looping: false, volume: 0.6});
            this.reload = 20;
        }
    }
});

var Bug = Entity.extend({
    lifetime: 32,
    move_x: 0,
    move_y: 0,
    speed: 2,
    rotation: 0,
    draw: function (ctx) {
        let sprite_name = "bug";
        switch (this.rotation) {
            case 0: sprite_name = "bug"; break;
            case 90: sprite_name = "bug_r"; break;
            case 180: sprite_name = "bug_b"; break;
            case 270: sprite_name = "bug_l"; break;
        }
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
        if (this.lifetime <= 0) {
            this.kill();
            return;
        }
        let rand = Math.random();
        if (rand >= 0.9) {
            randMove(this);
        }
        physicManager.update(this);
        return;
    },
})

var Crash = Entity.extend({
    lifetime: 64,
    move_x: 0,
    move_y: 0,
    speed: 4,
    rotation: 0,
    draw: function (ctx) {
        let sprite_name = "crash";
        switch (this.rotation) {
            case 0: sprite_name = "crash"; break;
            case 90: sprite_name = "crash_r"; break;
            case 180: sprite_name = "crash_b"; break;
            case 270: sprite_name = "crash_l"; break;
        }
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
        if (this.lifetime <= 0) {
            this.kill();
            return;
        }
        let rand = Math.random();
        if (rand >= 0.85) {
            randMove(this);
        }
        rand = Math.random();
        if (rand >= 0.94) {
            let tx = 0;
            let ty = 0;
            switch (this.rotation) {
                case 0: ty = -24; break;
                case 90: tx = 24; break;
                case 180: ty = 24; break;
                case 270: tx = -24; break;
            }
            for (let i = 0; i <= 10; i++) {
                let e = physicManager.playerAtXY(this.pos_x + i*tx, this.pos_y + i*ty);
                if (e !== null) {
                    if (e.name === "player") {
                        this.fire();
                    }
                }
            }
        }
        physicManager.update(this);
        return;
    },
    fire: function () {
        var r = Object.create(SegFault);
        r.size_x = 24;
        r.size_y = 24;
        r.name = "segf"  + gameManager.segIndex++;
        r.move_x = 0;
        r.move_y = 0;
        switch (this.rotation) {
            case 90:
                r.pos_x = this.pos_x + this.size_x - 10;
                r.pos_y = this.pos_y;
                r.move_x = 1;
                break;
            case 180:
                r.pos_y = this.pos_y + this.size_y - 10;
                r.pos_x = this.pos_x;
                r.move_y = 1;
                break;
            case 270:
                r.pos_x = this.pos_x - r.size_x + 10;
                r.pos_y = this.pos_y;
                r.move_x = -1;
                break;
            case 0:
                r.pos_y = this.pos_y - r.size_y + 10;
                r.pos_x = this.pos_x;
                r.move_y = -1;
                break;
        }
        soundManager.play(this.pos_x, this.pos_y, "sounds/segf.mp3", {looping: false, volume: 0.6});
        gameManager.entities.push(r);
    }
})

var Vim = Entity.extend({
    lifetime: 128,
    move_x: 0,
    move_y: 0,
    speed: 1,
    rotation: 0,
    draw: function (ctx) {
        let sprite_name = "vim";
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    fire: function () {
        var r = Object.create(SegFault);
        r.size_x = 24;
        r.size_y = 24;
        r.name = "segf" + gameManager.segIndex++;
        r.move_x = 0;
        r.move_y = 0;
        switch (this.rotation) {
            case 0:
                r.pos_x = this.pos_x + this.size_x - 10;
                r.pos_y = this.pos_y;
                r.move_x = 1;
                break;
            case 180:
                r.pos_y = this.pos_y + this.size_y - 10;
                r.pos_x = this.pos_x;
                r.move_y = 1;
                break;
            case 270:
                r.pos_x = this.pos_x - r.size_x + 10;
                r.pos_y = this.pos_y;
                r.move_x = -1;
                break;
            case 90:
                r.pos_y = this.pos_y - r.size_y + 10;
                r.pos_x = this.pos_x;
                r.move_y = -1;
                break;
        }
        soundManager.play(this.pos_x, this.pos_y, "sounds/segf.mp3", {looping: false, volume: 0.6});
        gameManager.entities.push(r);
    },
    update: function () {
        let rand = Math.random();
        if (rand >= 0.8) {
            randMove(this);
        }
        rand = Math.random();
        if (rand >= 0.95) {
            this.fire();
        }
        physicManager.update(this);
        return;
    },
})

var Error = Entity.extend({
    damage: 32,
    draw: function (ctx) {
        let sprite_name = "error";
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
    },
})

var Memory = Entity.extend({
    bonus: 16,
    draw: function (ctx) {
        let sprite_name = "memory";
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
    },
})

var Fix = Entity.extend({
    damage: 8,
    speed: 6,
    draw: function (ctx) {
        let sprite_name = "fix";
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
        physicManager.update(this);
    }
})

var SegFault = Entity.extend({
    damage: 8,
    speed: 6,
    draw: function (ctx) {
        let sprite_name = "segf";
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    },
    update: function () {
        physicManager.update(this);
    }
})