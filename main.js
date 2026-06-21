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
var showMovementPath = false;
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

let attackButtonId = 2;
let dashButtonId = 1;
let commandButtonId = 3;
let turnButtonId = 0;
let diagonalButtonId = 5;
let shootButtonId = 4;
let mapButtonId = 7;

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

        // Z 攻撃・選択
        gamepad_key_list[var_655] = gp.buttons[attackButtonId]?.pressed ? 1 : 0;
        // X キャンセル
        gamepad_key_list[var_656] = gp.buttons[dashButtonId]?.pressed ? 1 : 0;
        // A メニュー
        gamepad_key_list[var_657] = gp.buttons[commandButtonId]?.pressed ? 1 : 0;
        // Space 地図
        gamepad_key_list[32] = gp.buttons[mapButtonId]?.pressed ? 1 : 0;
        // C 方向
        gamepad_key_list[var_660] = gp.buttons[turnButtonId]?.pressed ? 1 : 0;
        // Shift 斜め移動補助
        gamepad_key_list[var_659] = gp.buttons[diagonalButtonId]?.pressed ? 1 : 0;
        // S 射撃
        gamepad_key_list[var_658] = gp.buttons[shootButtonId]?.pressed ? 1 : 0;
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
            attackButtonId,
            dashButtonId,
            commandButtonId,
            turnButtonId,
            diagonalButtonId,
            shootButtonId,
            mapButtonId,
            showMovementPath,
            アイテムジャンル: "装備DISC",
            アイテムジャンル一覧: ["装備DISC", "射撃DISC", "記憶DISC", "食べ物", "消費アイテム", "壺", "コミック"],
            アイテム: 装備DISC一覧[0],
            アイテム一覧: {
                装備DISC: 装備DISC一覧,
                射撃DISC: 射撃DISC一覧,
                記憶DISC: 記憶DISC一覧,
                食べ物: 食べ物一覧,
                消費アイテム: 消費アイテム一覧,
                壺: 壺一覧,
                コミック: コミック一覧
            },
        };
    },
    created() {
        attackButtonId = this.attackButtonId = Number(localStorage.getItem("attackButtonId") ?? 1);
        dashButtonId = this.dashButtonId = Number(localStorage.getItem("dashButtonId") ?? 0);
        commandButtonId = this.commandButtonId = Number(localStorage.getItem("commandButtonId") ?? 3);
        turnButtonId = this.turnButtonId = Number(localStorage.getItem("turnButtonId") ?? 2);
        diagonalButtonId = this.diagonalButtonId = Number(localStorage.getItem("diagonalButtonId") ?? 5);
        shootButtonId = this.shootButtonId = Number(localStorage.getItem("shootButtonId") ?? 4);
        mapButtonId = this.mapButtonId = Number(localStorage.getItem("mapButtonId") ?? 7);
        showMovementPath = this.showMovementPath = localStorage.getItem("showMovementPath") === "true";
    },
    mounted() {
        //
    },
    watch: {
        //
    },
    methods: {
        onChangeAttackButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                attackButtonId = Number(strVal);
                localStorage.setItem("attackButtonId", attackButtonId);
            }
            else {
                e.target.value = this.attackButtonId;
            }
        },
        onChangeDashButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                dashButtonId = Number(strVal);
                localStorage.setItem("dashButtonId", dashButtonId);
            }
            else {
                e.target.value = this.dashButtonId;
            }
        },
        onChangeCommandButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                commandButtonId = Number(strVal);
                localStorage.setItem("commandButtonId", commandButtonId);
            }
            else {
                e.target.value = this.commandButtonId;
            }
        },
        onChangeTurnButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                turnButtonId = Number(strVal);
                localStorage.setItem("turnButtonId", turnButtonId);
            }
            else {
                e.target.value = this.turnButtonId;
            }
        },
        onChangeDiagonalButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                diagonalButtonId = Number(strVal);
                localStorage.setItem("diagonalButtonId", diagonalButtonId);
            }
            else {
                e.target.value = this.diagonalButtonId;
            }
        },
        onChangeShootButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                shootButtonId = Number(strVal);
                localStorage.setItem("shootButtonId", shootButtonId);
            }
            else {
                e.target.value = this.shootButtonId;
            }
        },
        onChangeMapButtonId(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                mapButtonId = Number(strVal);
                localStorage.setItem("mapButtonId", mapButtonId);
            }
            else {
                e.target.value = this.mapButtonId;
            }
        },
        unlockAllDungeons() {
            var_404 = 1;
            var_704[88] = 1;
            var_704[34] = 1;
            var_704[93] = 2;
            var_526 = 2;
            var_993 = 1;
            var_704[218] = 1;
            var_704[235] = 1;
            var_704[221] = 2;
            var_523 = 1;
            var_524 = 1;
            var_759 = 2;
        },
        onChangeShowMovementPath(e) {
            showMovementPath = event.target.checked;
            localStorage.setItem("showMovementPath", showMovementPath);
        },
        onChangeアイテムジャンル(アイテムジャンル) {
            this.アイテムジャンル = アイテムジャンル;
            this.アイテム = this.アイテム一覧[アイテムジャンル][0];
        },
        onChangeアイテム(index) {
            this.アイテム = this.アイテム一覧[this.アイテムジャンル][index];
        },
        addItem() {
            for (let i = 1; i <= 20; i++) {
                const item = var_233[i];
                if (item.Var0 === 0) {
                    var_224++;
                    item.Var0 = this.アイテム.id;
                    if (this.アイテムジャンル === "装備DISC") {
                        item.Var5 = this.アイテム.Var5;
                        item.Var16 = this.アイテム.Var16;
                        item.Var20 = this.アイテム.id;
                        this.Var14 = 0;
                        item.Var19 = 1;
                    }
                    else if (this.アイテムジャンル === "射撃DISC") {
                        item.Var3 = 5;
                    }
                    else if (this.アイテムジャンル === "壺") {
                        item.Var7 = 5;
                        item.Var6 = var_858;

                        var_486[var_858][1][0] = 0;
                        var_486[var_858][2][0] = 0;
                        var_486[var_858][3][0] = 0;
                        var_486[var_858][4][0] = 0;
                        var_486[var_858][5][0] = 0;
                        var_486[var_858][6][0] = 0;
                        var_486[var_858][7][0] = 0;
                        var_486[var_858][8][0] = 0;
                        var_486[var_858][9][0] = 0;
                        var_486[var_858][10][0] = 0;

                        var_858 += 1;
                        if (var_858 > 79) {
                            var_858 = 0;
                        }
                    }
                    break;
                }
            }
        },
    },
};

Vue.createApp(ConfigApp).mount("#config");
