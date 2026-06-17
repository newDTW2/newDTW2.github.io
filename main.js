for (var i = 0; i < 3600; ++i) {
    eval("var var_" + i + " = 0;");
}
var_754 = 1;
var_2156 = 2;
var_25 = [];
var_26 = [];
var_27 = [];
var var_25_x;
var var_26_x;
var var_27_x;
var_494 = [];
var_664 = [];
var_691 = [];
InitInput();
window.onload = func001;

// 高画質化
// 参考元：https://github.com/zawatton/newDTW.github.io/blob/25f9a3b/public/index.html
window.addEventListener("load", () => {
    setTimeout(() => {
        const canvas = document.getElementById("c0");
        const context = canvas.getContext("2d");
        const dpr = devicePixelRatio || 1;
        canvas.width = 680 * dpr;
        canvas.height = 680 * dpr;
        context.setTransform(dpr * 2, 0, 0, dpr * 2, 0, 0);
        context.imageSmoothingEnabled = false;
    }, 300);
});

// ゲームパッド対応
// https://w3c.github.io/gamepad/#remapping
(function updateGamepad() {
    const gp = navigator.getGamepads()[0];
    if (gp) {
        // アナログスティック
        // 左右上下
        gamepad_key_list[var_647] = gp.axes[0] < -0.5 ? 1 : 0;
        gamepad_key_list[var_648] = gp.axes[0] >  0.5 ? 1 : 0;
        gamepad_key_list[var_649] = gp.axes[1] < -0.5 ? 1 : 0;
        gamepad_key_list[var_650] = gp.axes[1] >  0.5 ? 1 : 0;

        // 注意：gp.buttonsのindexの割り当ては機種依存
        // 各自コードを書き換えてください。

        // Z 攻撃・選択
        gamepad_key_list[var_655] = gp.buttons[1]?.pressed ? 1 : 0;
        // X キャンセル
        gamepad_key_list[var_656] = gp.buttons[2]?.pressed ? 1 : 0;
        // A メニュー
        gamepad_key_list[var_657] = gp.buttons[0]?.pressed ? 1 : 0;
        // Space 地図
        gamepad_key_list[32] = gp.buttons[7]?.pressed ? 1 : 0;
        // C 方向
        gamepad_key_list[var_660] = gp.buttons[3]?.pressed ? 1 : 0;
        // Shift 斜め移動補助
        gamepad_key_list[var_659] = gp.buttons[5]?.pressed ? 1 : 0;
        // S 射撃
        gamepad_key_list[var_658] = gp.buttons[4]?.pressed ? 1 : 0;
    }
    requestAnimationFrame(updateGamepad);
})();

// 自動セーブ
window.addEventListener("pagehide", e => {
    if (!e.persisted) {
        if (localStorage.getItem(var_735)) {
            func231();
        }
    }
});

// Vue

const ConfigApp = {
    data() {
        return {
            //
        };
    },
    created() {
        //
    },
    mounted() {
        //
    },
    watch: {
        //
    },
    methods: {
        //
    },

};

Vue.createApp(ConfigApp).mount("#config");
