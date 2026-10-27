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

const canvas = document.getElementById("c0");
const isMobile = navigator.userAgentData?.mobile ?? (/iPhone|Android.+Mobile/.test(navigator.userAgent));

let isPressedF = false;
let shouldPlayBgm = true;
let specialRule = localStorage.getItem("specialRule") ?? "通常";

// 高画質化
// 参考元：https://github.com/zawatton/newDTW.github.io/blob/25f9a3b/public/index.html
if (!isMobile) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const context = canvas.getContext("2d");
            const dpr = devicePixelRatio || 1;
            canvas.width = 680 * dpr;
            canvas.height = 680 * dpr;
            context.setTransform(dpr * 2, 0, 0, dpr * 2, 0, 0);
            context.imageSmoothingEnabled = false;
        }, 300);
    });
}

// ゲームパッド対応
// https://w3c.github.io/gamepad/#remapping
function updateGamepad() {
    const gp = navigator.getGamepads()[0];
    if (gp) {
        // アナログスティック
        // 左右上下
        gamepad_key_list[var_647] = gp.axes[0] < -0.5 ? 1 : 0;
        gamepad_key_list[var_648] = gp.axes[0] >  0.5 ? 1 : 0;
        gamepad_key_list[var_649] = gp.axes[1] < -0.5 ? 1 : 0;
        gamepad_key_list[var_650] = gp.axes[1] >  0.5 ? 1 : 0;

        // Z 攻撃・選択
        gamepad_key_list[var_655] = gp.buttons[vm.attackButtonIndex]?.pressed ? 1 : 0;
        // X キャンセル
        gamepad_key_list[var_656] = gp.buttons[vm.dashButtonIndex]?.pressed ? 1 : 0;
        // A メニュー
        gamepad_key_list[var_657] = gp.buttons[vm.commandButtonIndex]?.pressed ? 1 : 0;
        // Space 地図
        gamepad_key_list[32] = gp.buttons[vm.mapButtonIndex]?.pressed ? 1 : 0;
        // C 方向
        gamepad_key_list[var_660] = gp.buttons[vm.turnButtonIndex]?.pressed ? 1 : 0;
        // Shift 斜め移動補助
        gamepad_key_list[var_659] = gp.buttons[vm.diagonalButtonIndex]?.pressed ? 1 : 0;
        // S 射撃
        gamepad_key_list[var_658] = gp.buttons[vm.shootButtonIndex]?.pressed ? 1 : 0;
        // F FF
        gamepad_key_list[70] = gp.buttons[vm.ffButtonIndex]?.pressed ? 1 : 0;
    }
    requestAnimationFrame(updateGamepad);
}

// Vue

const App = {
    data() {
        return {
            canCheat: false,
            canSave: true,
            isMobile: isMobile,
            isLandscape: [90, 270].includes(screen.orientation.angle),
            padEnabled: false,
            attackButtonIndex: 2,
            dashButtonIndex: 1,
            commandButtonIndex: 3,
            turnButtonIndex: 0,
            diagonalButtonIndex: 5,
            shootButtonIndex: 4,
            mapButtonIndex: 7,
            ffButtonIndex: 6,
            showMovementPath: false,
            itemType: "装備DISC",
            itemTypeList: ["装備DISC", "射撃DISC", "記憶DISC", "食べ物", "消費アイテム", "壺", "コミック"],
            item: 装備DISC一覧[0],
            itemDic: {
                装備DISC: 装備DISC一覧,
                射撃DISC: 射撃DISC一覧,
                記憶DISC: 記憶DISC一覧,
                食べ物: 食べ物一覧,
                消費アイテム: 消費アイテム一覧,
                壺: 壺一覧,
                コミック: コミック一覧
            },
            currentFloor: 1,
            specialRule,
            specialRuleDescription: {
                "通常": "通常の「ディアボロの試練」です。",
                "3部縛り": "・装備DISCは3部のみ出現する\n・射撃DISCは3部のみ出現する\n・特定の部のコミックが出現しない",
                "4部縛り": "・装備DISCは4部のみ出現する\n・射撃DISCは4部のみ出現する\n・特定の部のコミックが出現しない",
                "5部縛り": "・装備DISCは5部のみ出現する\n・射撃DISCは5部のみ出現する\n・特定の部のコミックが出現しない",
                "6部縛り": "・装備DISCは6部のみ出現する\n・射撃DISCは6部のみ出現する\n・特定の部のコミックが出現しない",
                "牙（タスク）": "・ディアボロの通常攻撃1ダメージ固定\n・射撃ボタンでタスクが無限に撃てる\n・射撃DISCが出現しやすい\n・鉄球が出現しやすい\n・コミックは7部のみ出現する\n・2レベル上がるたびに精神力が1上がる",
                "Do or Die": "直接攻撃で即死\n・ディアボロの攻撃は外れない\n・全フロア視界明瞭\n・「絶頂の能力」",
            }
        };
    },
    created() {
        this.canCheat = (new URL(window.location.href)).searchParams.has("c");

        this.attackButtonIndex = Number(localStorage.getItem("attackButtonIndex") ?? 1);
        this.dashButtonIndex = Number(localStorage.getItem("dashButtonIndex") ?? 0);
        this.commandButtonIndex = Number(localStorage.getItem("commandButtonIndex") ?? 3);
        this.turnButtonIndex = Number(localStorage.getItem("turnButtonIndex") ?? 2);
        this.diagonalButtonIndex = Number(localStorage.getItem("diagonalButtonIndex") ?? 5);
        this.shootButtonIndex = Number(localStorage.getItem("shootButtonIndex") ?? 4);
        this.mapButtonIndex = Number(localStorage.getItem("mapButtonIndex") ?? 7);
        this.ffButtonIndex = Number(localStorage.getItem("ffButtonIndex") ?? 6);
        this.showMovementPath = localStorage.getItem("showMovementPath") === "true";

        if (this.isMobile) {
            window.addEventListener("orientationchange", () => {
                this.isLandscape = [90, 270].includes(screen.orientation.angle);
            });
            window.addEventListener("scroll", () => {
                this.resizeCanvas();
            });
        }

        // 自動セーブ
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (this.canSave && localStorage.getItem(var_735)) {
                    var_205 = 1;
                    func231();
                }
            }
        });
    },
    mounted() {
        updateGamepad();
        func001();
    },
    watch: {
        isLandscape: {
            immediate: true,
            handler(newVal) {
                if (!newVal && this.padEnabled) {
                    this.togglePad();
                }
                this.resizeCanvas();
            }
        },
    },
    methods: {
        resizeCanvas() {
            if (!this.isMobile) {
                return;
            }
            if (this.isLandscape) {
                const maxWidth = Math.min(window.innerWidth, window.innerHeight);
                canvas.style.minWidth = "auto";
                canvas.style.maxWidth = maxWidth + "px";
            }
            else {
                canvas.style.minWidth = "";
                canvas.style.maxWidth = "";
            }
        },
        togglePad() {
            this.padEnabled = !this.padEnabled;
            document.body.style.overflow = this.padEnabled ? "hidden" : "";
        },
        onChangeAttackButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.attackButtonIndex = Number(strVal);
                localStorage.setItem("attackButtonIndex", this.attackButtonIndex);
            }
            else {
                e.target.value = this.attackButtonIndex;
            }
        },
        onChangeDashButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.dashButtonIndex = Number(strVal);
                localStorage.setItem("dashButtonIndex", this.dashButtonIndex);
            }
            else {
                e.target.value = this.dashButtonIndex;
            }
        },
        onChangeCommandButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.commandButtonIndex = Number(strVal);
                localStorage.setItem("commandButtonIndex", this.commandButtonIndex);
            }
            else {
                e.target.value = this.commandButtonIndex;
            }
        },
        onChangeTurnButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.turnButtonIndex = Number(strVal);
                localStorage.setItem("turnButtonIndex", this.turnButtonIndex);
            }
            else {
                e.target.value = this.turnButtonIndex;
            }
        },
        onChangeDiagonalButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.diagonalButtonIndex = Number(strVal);
                localStorage.setItem("diagonalButtonIndex", this.diagonalButtonIndex);
            }
            else {
                e.target.value = this.diagonalButtonIndex;
            }
        },
        onChangeShootButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.shootButtonIndex = Number(strVal);
                localStorage.setItem("shootButtonIndex", this.shootButtonIndex);
            }
            else {
                e.target.value = this.shootButtonIndex;
            }
        },
        onChangeMapButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.mapButtonIndex = Number(strVal);
                localStorage.setItem("mapButtonIndex", this.mapButtonIndex);
            }
            else {
                e.target.value = this.mapButtonIndex;
            }
        },
        onChangeFFButtonIndex(e) {
            const strVal = e.target.value;
            if (/^\d+$/.test(strVal)) {
                this.ffButtonIndex = Number(strVal);
                localStorage.setItem("ffButtonIndex", this.ffButtonIndex);
            }
            else {
                e.target.value = this.ffButtonIndex;
            }
        },
        onPointerDown(e, strIndexVar) {
            e.target.setPointerCapture(e.pointerId);
            gamepad_key_list[window[strIndexVar]] = 1;
        },
        onPointerUp(strIndexVar) {
            gamepad_key_list[window[strIndexVar]] = 0;
        },
        onPointerDown2(e, code) {
            e.target.setPointerCapture(e.pointerId);
            gamepad_key_list[code] = 1;
        },
        onPointerUp2(code) {
            gamepad_key_list[code] = 0;
        },
        move(dirX, dirY, e) {
            if (e) {
                e.target.setPointerCapture(e.pointerId);
            }
            const flag = e ? 1 : 0;
            if (dirX < 0) {
                pushing_key_list[37] = flag;
            }
            else if (dirX > 0) {
                pushing_key_list[39] = flag;
            }
            if (dirY < 0) {
                pushing_key_list[38] = flag;
            }
            else if (dirY > 0) {
                pushing_key_list[40] = flag;
            }
        },
        onPointerDownMap(e) {
            e.target.setPointerCapture(e.pointerId);
            gamepad_key_list[32] = 1;
        },
        onPointerUpMap() {
            gamepad_key_list[32] = 0;
        },
        unlockAllDungeons() {
            var_404 = 1;
            var_704[88] = 1;
            var_704[34] = 1;
            var_704[93] = 2;
            var_526 = 2;
            var_993 = 1;
            var_704[218] = 1;
            // var_704[235] = 1; // 没ダンジョン：鉄の牢獄
            var_704[221] = 2;
            var_523 = 1;
            // var_524 = 1; // 没ダンジョン：鉄の牢獄
            var_759 = 2;
        },
        completeEnemyBook() {
            let i = 1;
            // 一部
            var_989[i++] = 140;
            var_989[i++] = 138;
            var_989[i++] = 36
            var_989[i++] = 5;
            var_989[i++] = 105;
            var_989[i++] = 51;
            var_989[i++] = 52;
            var_989[i++] = 69;
            var_989[i++] = 66;
            var_989[i++] = 73;
            var_989[i++] = 71;
            var_989[i++] = 101;
            var_989[i++] = 102;
            var_989[i++] = 103;
            var_989[i++] = 104;
            // 二部
            var_989[i++] = 135;
            var_989[i++] = 95;
            var_989[i++] = 94;
            var_989[i++] = 56;
            var_989[i++] = 86;
            var_989[i++] = 88;
            var_989[i++] = 136;
            var_989[i++] = 87;
            var_989[i++] = 164;
            var_989[i++] = 109;
            var_989[i++] = 139;
            var_989[i++] = 11;
            var_989[i++] = 75;
            var_989[i++] = 110;
            var_989[i++] = 111;
            // 三部
            var_989[i++] = 120;
            var_989[i++] = 119;
            var_989[i++] = 78;
            var_989[i++] = 121;
            var_989[i++] = 122;
            var_989[i++] = 146;
            var_989[i++] = 3;
            var_989[i++] = 6;
            var_989[i++] = 165;
            var_989[i++] = 9;
            var_989[i++] = 46;
            var_989[i++] = 7;
            var_989[i++] = 20;
            var_989[i++] = 8;
            var_989[i++] = 24;
            var_989[i++] = 25;
            var_989[i++] = 23;
            var_989[i++] = 13;
            var_989[i++] = 19;
            var_989[i++] = 90;
            var_989[i++] = 4;
            var_989[i++] = 28;
            var_989[i++] = 22;
            var_989[i++] = 16;
            var_989[i++] = 57;
            var_989[i++] = 108;
            var_989[i++] = 27;
            var_989[i++] = 97;
            var_989[i++] = 58;
            var_989[i++] = 14;
            var_989[i++] = 129;
            var_989[i++] = 155;
            var_989[i++] = 38;
            var_989[i++] = 30;
            var_989[i++] = 126;
            var_989[i++] = 15;
            var_989[i++] = 133;
            var_989[i++] = 118;
            var_989[i++] = 2;
            var_989[i++] = 113;
            var_989[i++] = 114;
            // 四部
            var_989[i++] = 35;
            var_989[i++] = 68;
            var_989[i++] = 128;
            var_989[i++] = 115;
            var_989[i++] = 47;
            var_989[i++] = 67;
            var_989[i++] = 65;
            var_989[i++] = 40;
            var_989[i++] = 54;
            var_989[i++] = 41;
            var_989[i++] = 42;
            var_989[i++] = 145;
            var_989[i++] = 150;
            var_989[i++] = 79;
            var_989[i++] = 77;
            var_989[i++] = 91;
            var_989[i++] = 76;
            var_989[i++] = 92;
            var_989[i++] = 12;
            var_989[i++] = 116;
            var_989[i++] = 83;
            var_989[i++] = 49;
            var_989[i++] = 45;
            var_989[i++] = 158;
            var_989[i++] = 33;
            var_989[i++] = 34;
            var_989[i++] = 44;
            var_989[i++] = 147;
            var_989[i++] = 172;
            var_989[i++] = 142;
            var_989[i++] = 151;
            var_989[i++] = 26;
            var_989[i++] = 32;
            var_989[i++] = 17;
            var_989[i++] = 31;
            var_989[i++] = 144;
            var_989[i++] = 39;
            var_989[i++] = 21;
            var_989[i++] = 137;
            // 五部
            var_989[i++] = 131;
            var_989[i++] = 53;
            var_989[i++] = 123;
            var_989[i++] = 81;
            var_989[i++] = 124;
            var_989[i++] = 125;
            var_989[i++] = 48;
            var_989[i++] = 152;
            var_989[i++] = 163;
            var_989[i++] = 18;
            var_989[i++] = 55;
            var_989[i++] = 63;
            var_989[i++] = 106;
            var_989[i++] = 107;
            var_989[i++] = 62;
            var_989[i++] = 64;
            var_989[i++] = 10;
            var_989[i++] = 85;
            var_989[i++] = 84;
            var_989[i++] = 117;
            var_989[i++] = 29;
            var_989[i++] = 43;
            var_989[i++] = 132;
            var_989[i++] = 1;
            // 六部
            var_989[i++] = 134;
            var_989[i++] = 148;
            var_989[i++] = 141;
            var_989[i++] = 93;
            var_989[i++] = 96;
            var_989[i++] = 99;
            var_989[i++] = 153;
            var_989[i++] = 156;
            var_989[i++] = 80;
            var_989[i++] = 74;
            var_989[i++] = 154;
            var_989[i++] = 157;
            var_989[i++] = 160;
            var_989[i++] = 72;
            var_989[i++] = 61;
            var_989[i++] = 59;
            var_989[i++] = 143;
            var_989[i++] = 166;
            var_989[i++] = 159;
            var_989[i++] = 170;
            var_989[i++] = 127;
            var_989[i++] = 60;
            var_989[i++] = 98;
            // その他
            var_989[i++] = 161;
            var_989[i++] = 162;
            var_989[i++] = 37;
            var_989[i++] = 168;

            var_1038 = i;
        },
        onChangeShowMovementPath(e) {
            this.showMovementPath = e.target.checked;
            localStorage.setItem("showMovementPath", this.showMovementPath);
        },
        async importSaveFile(e) {
            if (!confirm("既存データが無くなりますがよろしいですか？")) return;

            try {
                const file = e.target.files[0];
                const text = await file.text();
                const data = JSON.parse(text);

                localStorage.clear();

                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, value);
                }

                this.canSave = false;
                location.reload();
            }
            catch (error) {
                alert("インポートに失敗しました");
            }
        },
        exportSaveFile() {
            const data = {};

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }

            const blob = new Blob(
                [JSON.stringify(data, null, 2)],
                { type: "application/json;charset=utf-8" }
            );

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = "diavolo.json";
            a.click();

            URL.revokeObjectURL(url);
        },
        onChangeアイテムジャンル(itemType) {
            this.itemType = itemType;
            this.item = this.itemDic[itemType][0];
        },
        onChangeアイテム(index) {
            this.item = this.itemDic[this.itemType][index];
        },
        addItem() {
            for (let i = 1; i <= 20; i++) {
                const item = var_233[i];
                if (item.Var0 === 0) {
                    var_224++;
                    item.Var0 = this.item.id;
                    if (this.itemType === "装備DISC") {
                        item.Var5 = this.item.Var5;
                        item.Var16 = this.item.Var16;
                        item.Var20 = this.item.id;
                        this.Var14 = 0;
                        item.Var19 = 1;
                    }
                    else if (this.itemType === "射撃DISC") {
                        item.Var3 = 5;
                    }
                    else if (this.itemType === "壺") {
                        item.Var7 = 6;
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

                        // トラクターのタイヤ
                        if (item.Var0 === 802) {
                            item.Var7 = 10;
                        }
                        // ホルマジオの瓶
                        else if (item.Var0 === 851) {
                            item.Var7 -= 1;
                            item.Var8 = 1;
                            var_486[var_858][1][15] = 37;
                        }

                        var_858 += 1;
                        if (var_858 > 79) {
                            var_858 = 0;
                        }
                    }

                    // 識別済みにする
                    item.Var14 = 1;
                    var_862[item.Var0][0] = 1;
                    break;
                }
            }
        },
        changeCurrentFloor() {
            if (/^\d+$/.test(this.currentFloor)) {
                this.currentFloor = Number(this.currentFloor);
            }
            else {
                this.currentFloor = 1;
                return;
            }
            var_91 = this.currentFloor;
        },
    },
};

const vm = Vue.createApp(App).mount("#app");

// debug

window.addEventListener("error", e => {
    const point = `${e.filename.split("/").pop()}:${e.lineno}`;
    const message = e.message;
    alert(`【Error】\n${point}\n${message}`);
});
