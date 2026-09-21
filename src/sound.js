function loadSound(path, _option = null) {
    return new Promise((resolve, reject) => {
        const option = {
            src: [path],
            volume: 1,

            // trueだとユーザー操作がどうのこうので音が鳴らない場合がある。例えユーザー操作があっても。
            html5: false,
            
            // https://github.com/goldfire/howler.js/issues/293
            onload() {
                // https://github.com/goldfire/howler.js/issues/1586
                if (useManualLoop) {
                    const audio = sound._sounds[0]._node;
                    audio.addEventListener("ended", function() {
                        this.currentTime = 0;
                        this.play();
                    });
                }
                resolve(sound);
            },
            onloaderror(id, message) {
                reject(new Error(message));
            },
            onplayerror(id, message) {
                if (option.html5) {
                    sound.once("unlock", () => {
                        sound.play();
                    });
                }
                else {
                    throw new Error(message);
                }
            },
        };
        if (_option !== null) {
            Object.assign(option, _option);
        }
        // https://github.com/goldfire/howler.js/issues/1586
        const useManualLoop = option.html5 && option.loop;
        if (useManualLoop) {
            option.loop = false;
        }
        const sound = new Howl(option);
    });
}

function playSound(soundPromise, volume) {
    soundPromise.then(sound => {
        const state = sound.state();
        if (state !== "loaded") {
            throw new Error(`sound.state() → ${state}`);
        }
        sound.volume(volume);
        return new Promise(resolve => {
            // https://github.com/goldfire/howler.js/issues/1753
            if (!sound._html5 && (Howler.ctx.state === "suspended" || Howler.ctx.state === "interrupted")) {
                Howler.ctx.resume().then(() => {
                    sound.play();
                    resolve();
                });
            }
            else {
                sound.play();
                resolve();
            }
        });
    });
}
