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

// ゲームパッド対応
// https://w3c.github.io/gamepad/#remapping
(function updateGamepad() {
    const gp = navigator.getGamepads()[0];
    if (gp) {
        // アナログスティック
        // 左右上下
        gamepad_key_list[37] = gp.axes[0] < -0.5 ? 1 : 0;
        gamepad_key_list[39] = gp.axes[0] >  0.5 ? 1 : 0;
        gamepad_key_list[38] = gp.axes[1] < -0.5 ? 1 : 0;
        gamepad_key_list[40] = gp.axes[1] >  0.5 ? 1 : 0;

        // 注意：gp.buttonsのindexの割り当ては機種依存
        // 各自コードを書き換えてください。

        // Z 攻撃・選択
        gamepad_key_list[90] = gp.buttons[1]?.pressed ? 1 : 0;
        // X キャンセル
        gamepad_key_list[88] = gp.buttons[2]?.pressed ? 1 : 0;
        // A メニュー
        gamepad_key_list[65] = gp.buttons[0]?.pressed ? 1 : 0;
        // Space 地図
        gamepad_key_list[32] = gp.buttons[7]?.pressed ? 1 : 0;
        // C 方向
        gamepad_key_list[67] = gp.buttons[3]?.pressed ? 1 : 0;
        // Shift 斜め移動補助
        gamepad_key_list[16] = gp.buttons[5]?.pressed ? 1 : 0;
        // S 射撃
        gamepad_key_list[83] = gp.buttons[4]?.pressed ? 1 : 0;
    }
    requestAnimationFrame(updateGamepad);
})();

// 自動セーブ
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        const fileName = `0${var_726}.dat`;
        if (localStorage.getItem(fileName)) {
            func231();
        }
    }
});
