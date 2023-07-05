var soundManager = {
    clips: {},
    context: null,
    gainNode: null,
    loaded: false,
    init: function () {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    },
    load: function (path, callback) {
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        var clip = { path: path, buffer: null, loaded: false };
        clip.play = function (volume, loop) {
            soundManager.play(this.path, { looping: loop ? loop : false, volume: volume ? volume : 1 });
        };
        this.clips[path] = clip;
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            soundManager.context.decodeAudioData(request.response, function (buffer) {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    },
    loadArray: function (array) {
        for (var i = 0; i < array.length; i++) {
            soundManager.load(array[i], function () {
                if (array.length === Object.keys(soundManager.clips).length) {
                    for (sd in soundManager.clips)
                        if (!soundManager.clips[sd].loaded) return;
                    soundManager.loaded = true;
                }
            });
        };
    },
    playSound: function (path, setting) {
        if (!soundManager.loaded) {
            setTimeout(function () {
                soundManager.playSound(path, setting)
            }), 1000
        }
        var looping = false;
        var volume = 1;

        if (setting) {
            if (setting.looping)
                looping = setting.looping
            if (setting.volume)
                volume = setting.volume
        }

        var sd = this.clips[path]
        if (sd == null)
            return false;

        var sound = soundManager.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(soundManager.gainNode);
        sound.loop = looping;
        soundManager.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    },
    play: function (x, y, path, setting) {
        if (gameManager.player === null)
            return;
        var dx = Math.abs(gameManager.player.pos_x - x);
        var dy = Math.abs(gameManager.player.pos_y - y);
        var dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 400) {
            soundManager.playSound(path, setting);
        }
    },
    stopAll: function () {
        if (this.gainNode) {
            this.gainNode.disconnect();
        }
    }
}