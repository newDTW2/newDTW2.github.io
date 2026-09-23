
function getFont(fontType, fontSize, fontStyle = null) {
    fontStyle = fontStyle || 0;
    const fontStyleList = ["", "bold", "italic"];
    const subFontType = fontType.endsWith("Ｐゴシック") ? "sans-serif" : "monospace";
    return `${fontStyleList[fontStyle]} ${fontSize}px '${fontType}', ${subFontType}`;
}

const measureText = (function() {
    const measureCanvas = new OffscreenCanvas(1, 1);
    const measureContext = measureCanvas.getContext("2d");
    return function (text, fontType, fontSize, fontStyle = null) {
        measureContext.font = getFont(fontType, fontSize, fontStyle);
        return measureContext.measureText(text).width;
    };
})();

function* activateFF() {
    var_2341 = 0;
    var_211 = var_211 + 20;
    if (var_120 == 1 || var_174 == 1) {
        var_211 = var_211 + 20;
    }
    if (var_211 >= var_352) {
        var_211 = var_352;
        var_2341 = 1;
    }
    var_293 = "";
    var_294 = "";
    var_295 = "";
    var_296 = "";
    var_297 = "";
    var_298 = "";
    var_299 = 0;
    var_293 = "傷口にプランクトンを詰めた。";
    if (var_120 == 1 || var_174 == 1) {
        var_294 = "いつもより多く回復した。";
    }
    if (var_2341 == 1) {
        var_294 = "体力が完全に回復した。";
    }
    var_198 = 1;
    var_300 = 0;
    var_25_x = var_25[1];
    var_26_x = var_26[1];
    var_27_x = var_27[1];
    yield func047();
    DSPLAY(143);
    var_1299 = 5;
    var_271 = 1;
    var_1297 = 1;
    for (var cnt2 = 0; cnt2 < 20; ++cnt2) {
        yield func337();
        var_1297++;
    }
    var_271 = 0;
    var_1297 = 0;
    var_232 = var_2258;
    yield func506();
    var_217 = 1;
    yield func019();
}
