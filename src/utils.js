
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
