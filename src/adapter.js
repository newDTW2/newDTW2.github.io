var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function dbgprt(num) {
}
function undef_func(str, arg = null) {
}
var stat = 0;
var strsize;
var wparam;
var hwnd;
var mousex;
var mousey;
var refstr;
var position = [0, 0];
var canvases = [];
var canvases_position = [];
var contexts = [];
var context;
var target_window_id = 0;
var line_size;
var pre_render_canvas = document.createElement('canvas');
var pushing_key_list = [];
var gamepad_key_list = [];
var alpha_mode = 0;
var alpha_color = "#ffffff";
var files = {};
var se = [];
var currentBgm = null;
var canvasContainer = document.getElementById("canvas-container");
var pre_pos = [0, 0];
function InitInput() {
    document.onkeydown = function (e) {
        pushing_key_list[e.keyCode] = 1;
        if (e.key === "F12") {
            // フルスクリーンモード無効
            pushing_key_list[e.keyCode] = 0;
        }
        else if (e.code === "Numpad1") {
            pushing_key_list[37] = 1; // 左
            pushing_key_list[40] = 1; // 下
        }
        else if (e.code === "Numpad2") {
            pushing_key_list[40] = 1; // 下
        }
        else if (e.code === "Numpad3") {
            pushing_key_list[39] = 1; // 右
            pushing_key_list[40] = 1; // 下
        }
        else if (e.code === "Numpad4") {
            pushing_key_list[37] = 1; // 左
        }
        else if (e.code === "Numpad6") {
            pushing_key_list[39] = 1; // 右
        }
        else if (e.code === "Numpad7") {
            pushing_key_list[37] = 1; // 左
            pushing_key_list[38] = 1; // 上
        }
        else if (e.code === "Numpad8") {
            pushing_key_list[38] = 1; // 上
        }
        else if (e.code === "Numpad9") {
            pushing_key_list[39] = 1; // 右
            pushing_key_list[38] = 1; // 上
        }
        else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "F1", "F2", "F3", "F4", "F5", "F6", "F7", " "].includes(e.key)) {
            // デフォルトの挙動を殺す
            e.preventDefault();
        }
    };
    document.onkeyup = function (e) {
        pushing_key_list[e.keyCode] = 0;
        if (e.code === "Numpad1") {
            pushing_key_list[37] = 0; // 左
            pushing_key_list[40] = 0; // 下
        }
        else if (e.code === "Numpad2") {
            pushing_key_list[40] = 0; // 下
        }
        else if (e.code === "Numpad3") {
            pushing_key_list[39] = 0; // 右
            pushing_key_list[40] = 0; // 下
        }
        else if (e.code === "Numpad4") {
            pushing_key_list[37] = 0; // 左
        }
        else if (e.code === "Numpad6") {
            pushing_key_list[39] = 0; // 右
        }
        else if (e.code === "Numpad7") {
            pushing_key_list[37] = 0; // 左
            pushing_key_list[38] = 0; // 上
        }
        else if (e.code === "Numpad8") {
            pushing_key_list[38] = 0; // 上
        }
        else if (e.code === "Numpad9") {
            pushing_key_list[39] = 0; // 右
            pushing_key_list[38] = 0; // 上
        }
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "F1", "F2", "F3", "F4", "F5", "F6", "F7", " "].includes(e.key)) {
            // デフォルトの挙動を殺す
            e.preventDefault();
        }
    };
}
// 参考元：https://github.com/zawatton/newDTW.github.io/blob/613da/src/renderer/adapter/await_.ts
let lastWaitTime = Date.now();
function await_(time) {
    // 前回呼び出しからの経過時間 (ms)
    const elapsed = Date.now() - lastWaitTime;
    // 待つべき残り時間
    const waitTime = Math.max(time - elapsed, 0);

    return new Promise((resolve) => {
        setTimeout(() => {
            // タイマー終了時に現在時刻を更新
            lastWaitTime = Date.now();
            resolve();
        }, waitTime);
    });
}
function bgscr(data0, data1, data2, data3, data4, data5, data6 = null, data7 = null) { undef_func("bgscr", [data0, data1, data2, data3, data4, data5, data6, data7]); }
function bload(file_name, data_size = null, offset = null) {
    if (file_name.split(".")[1] == "wav") {
        return loadSound("se/" + file_name);
    }
    if (file_name.split(".")[1] == "mp3") {
        return file_name;
    }
    if (file_name.split(".")[1] != "dat") {
        return [];
    }
    if (files[file_name] == undefined) {
        var load_data = window.localStorage.getItem(file_name);
        if (load_data != null) {
            files[file_name] = JSON.parse(load_data);
        }
        else {
            return;
        }
    }
    if (offset != null) {
        return files[file_name][offset];
    }
    else {
        return files[file_name][0];
    }
}
function boxf(left = null, top = null, right = null, bottom = null, isFill = true) {
    left = left || 0;
    top = top || 0;
    right = right || 680;
    bottom = bottom || 680;
    if ((target_window_id == 4 || target_window_id == 7 || target_window_id == 10 || target_window_id == 32) && left == 0 && top == 0) {
        return context.clearRect(left, top, right - left, bottom - top);
    }
    var ga = context.globalAlpha;
    context.globalAlpha = 1;
    if (isFill) {
        context.fillRect(left, top, right - left, bottom - top);
    }
    else {
        context.strokeRect(left, top, right - left, bottom - top);
    }
    context.globalAlpha = ga;
}
function bsave(file_name, data, data_size = null, offset = null) {
    offset = offset == null ? 0 : offset;
    data_size = data_size == null ? 0 : data_size;
    if (!files[file_name]) {
        files[file_name] = {};
    }
    files[file_name][offset] = data;
    localStorage.setItem(file_name, JSON.stringify(files[file_name]));
}
function buffer(id, disp_width = null, disp_height = null, mode = null) {
    target_window_id = id;
    var render_canvas;
    if (id != 0) {
        render_canvas = document.createElement('canvas');
        render_canvas.id = "c" + id;
    }
    else {
        render_canvas = document.getElementById("c0");
    }
    if (disp_width && disp_height) {
        render_canvas.width = disp_width;
        render_canvas.height = disp_height;
    }
    canvases[id] = render_canvas;
    contexts[id] = render_canvas.getContext('2d');
    gsel(id, target_window_id);
}
function button(data0, data1) { undef_func("button", [data0, data1]); }
function cls(id) {
    contexts[id].fillStyle = ["#fff", "#ccc", "888", "444", "#000"][id];
    contexts[id].fillRect(0, 0, 680, 680);
}
function chdir(data0) { undef_func("chdir", [data0]); }
function chgdisp(data0 = null, data1 = null, data2 = null) { undef_func("chgdisp", [data0, data1, data2]); }
function chkbox(data0, data1) { undef_func("chkbox", [data0, data1]); }
function clrobj(data0 = null, data1 = null) { undef_func("clrobj", [data0, data1]); }
function color(red, green, blue) {
    context.strokeStyle = context.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
}
function combox(data0, data1, data2) { undef_func("combox", [data0, data1, data2]); }
function delete_(data0) {
    localStorage.removeItem(data0);
    delete files[data0];
}
function dim(length1, length2 = null, length3 = null, length4 = null) {
    if (length4 != null) {
        throw "4重配列なんてありませんよ";
    }
    var return_list = [];
    for (var i = 0; i < length1; i++) {
        if (length2 != null) {
            return_list[i] = [];
            for (var j = 0; j < length2; j++) {
                if (length3 != null) {
                    return_list[i][j] = [];
                    for (var k = 0; k < length3; k++) {
                        return_list[i][j][k] = 0;
                    }
                }
                else {
                    return_list[i][j] = 0;
                }
            }
        }
        else {
            return_list[i] = 0;
        }
    }
    return return_list;
}
function dirinfo(data0) { undef_func("dirinfo", [data0]); }
function dirlist(data0, data1, data2 = null) { undef_func("dirlist", [data0, data1, data2]); }
function end() {
    location.reload();
}
function exist(file_name) {
    bload(file_name);
    if (files[file_name]) {
        strsize = Object.keys(files[file_name]).length;
    }
    else {
        strsize = -1;
    }
}
function font(font_type, font_size, font_style = null) {
    context.font = getFont(font_type, font_size, font_style);
    line_size = font_size;
}
function dialog(data0, data1, data2 = null) { undef_func("dialog", [data0, data1]); }
function gcopy(org_buffer_id, x, y, img_width, img_height) {
    gzoom(img_width, img_height, org_buffer_id, x, y, img_width, img_height, null);
}
function getkey(key_id) {
    return pushing_key_list[key_id] || gamepad_key_list[key_id] || 0;
}
function ResetKey(key_id) {
    pushing_key_list[key_id] = 0;
    gamepad_key_list[key_id] = 0;
}
function getstr(data0, data1, data2, data3) { undef_func("getstr", [data0, data1, data2, data3]); }
function gettime(data0) {
    const now = new Date();
    switch (data0) {
        case 0: return now.getFullYear();
        case 1: return now.getMonth() + 1;
        case 3: return now.getDate();
    }
}
function ginfo(data_id) {
    switch (data_id) {
        case 2:
            return target_window_id;
        case 4:
            return 0;
        case 5:
            return 0;
        case 20:
            return 340;
        case 21:
            return 340;
        case 22:
            return position[0];
        case 23:
            return position[1];
        default:
            throw "未実装だ! - " + data_id;
    }
}
function gmode(mode, data2 = null, data3 = null, alpha = null) {
    alpha_mode = mode;
    switch (mode) {
        case 2:
            alpha_color = "#000000";
        default:
            context.globalAlpha = 1;
            break;
        case 4:
            alpha_color = context.fillStyle;
        case 3:
            context.globalAlpha = alpha / 255;
    }
}
function grotate(org_buffer_id, x, y, radian, img_width, img_height) {
    context.save();
    context.translate(x, y);
    context.rotate(radian);
    context.translate(-x, -y);
    gcopy(org_buffer_id, x, y, img_width, img_height);
    context.restore();
}
function gsel(window_id, window_mode = null) {
    if (window_mode == 1) {
        canvases[window_id].style.display = "block";
    }
    if (window_mode == -1) {
        canvases[window_id].style.display = "none";
    }
    context = contexts[window_id];
    target_window_id = window_id;
}

const gzoom = (function() {
    let frameCount = 0;
    let fpsStart = null;
    let heFps = undefined;

    return function (dst_size_x, dst_size_y, org_buffer_id, x, y, img_width, img_height, mode) {
        if (org_buffer_id == 25) {
            var ctx = canvases[org_buffer_id].getContext('2d');
            var imgd = ctx.getImageData(position[0], position[1], img_width, img_height);
            var pix = imgd.data;
            for (var i = 0, n = pix.length; i < n; i += 4) {
                var grayscale = pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
                pix[i] = grayscale;
                pix[i + 1] = grayscale;
                pix[i + 2] = grayscale;
            }

            var tmp = document.createElement('canvas');
            tmp.width = img_width;
            tmp.height = img_height;
            tmp.getContext('2d').putImageData(imgd, 0, 0);

            context.drawImage(tmp, 0, 0, img_width, img_height, position[0], position[1], dst_size_x, dst_size_y);
            return;
        }
        else if (org_buffer_id == 8 && (x == 760 && y == 920 || x > 400 && y < 350)) {
            context.globalCompositeOperation = "destination-out";
            context.drawImage(canvases[org_buffer_id], x, y, img_width, img_height, position[0], position[1], dst_size_x, dst_size_y);
            context.globalCompositeOperation = "source-over";
        }
        else {
            if (isMobile && target_window_id === 0 && position[0] === 0 && position[1] === 0) {
                const now = performance.now();
                if (fpsStart === null) {
                    fpsStart = now;
                    frameCount = 1;
                } else {
                    frameCount++;
                    const elapsed = now - fpsStart;
                    if (elapsed >= 1000) {
                        const fps = frameCount * 1000 / elapsed;
                        // console.log(`FPS: ${fps.toFixed(1)}`);
                        if (!heFps) {
                            heFps = document.getElementById("fps");
                        }
                        heFps.innerText = `FPS: ${fps.toFixed(1)}`;
                        frameCount = 0;
                        fpsStart = now;
                    }
                }
            }
            context.drawImage(canvases[org_buffer_id], x, y, img_width, img_height, position[0], position[1], dst_size_x, dst_size_y);
        }
    }
})();

function input(data0, data1, data2, data3) { undef_func("input", [data0, data1, data2, data3]); }
function instr(data0, data1, data2) { undef_func("instr", [data0, data1, data2]); return 0; }
function int(data0) {
    return parseInt(data0);
}
function limit(val, min_val, max_val) {
    return Math.max(min_val, Math.min(val, max_val));
}
function line(start_x, start_y, end_x, end_y, lineWidth = 1) {
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(start_x, start_y);
    context.lineTo(end_x, end_y);
    context.stroke();
    context.lineWidth = 1;
}
function listbox(data0, data1, data2) { undef_func("listbox", [data0, data1, data2]); }
function mes(text) {
    var ga = context.globalAlpha;
    context.globalAlpha = 1;
    context.fillText(text, position[0], position[1] + line_size * 0.9);
    context.globalAlpha = ga;
    position[1] += line_size;
}
function mesbox(data0, data1, data2, data3) { undef_func("mesbox", [data0, data1, data2, data3]); }
function mkdir(data0) { undef_func("mkdir", [data0]); }
var selected_note = 0;
var note_data = [];
function noteadd(data, line_num, add_type) {
    if (add_type != 1) {
        throw "ERROR @ noteadd";
    }
    note_data[selected_note][line_num] = data;
}
function notedel(line_num) {
    note_data[selected_note].splice(line_num, 1);
}
function noteget(line_num) {
    return note_data[selected_note][line_num];
}
function noteinfo(info_type) {
    if (info_type == 0) {
        return note_data[selected_note].length;
    }
    else if (info_type == 1) {
        var sum = 0;
        for (var i in note_data[selected_note]) {
            sum += note_data[selected_note][i].length + 1;
        }
        return sum;
    }
}
function noteload(file_name) {
    note_data[selected_note] = bload(file_name);
}
function notesave(data0) {
    bsave(data0, note_data[selected_note]);
}
function notesel(note_id) {
    if (note_id == 0) {
        throw "ERROR @ notesel";
    }
    selected_note = note_id;
}
function objinfo(data0, data1, data2 = null) { undef_func("objinfo", [data0, data1, data2]); }
function objmode(data0, data1) { undef_func("objmode", [data0, data1]); }
function objprm(data0, data1) { undef_func("objprm", [data0, data1]); }
function objsel(data0) { undef_func("objsel", [data0]); }
function objsize(data0, data1 = null) { undef_func("objsize", [data0, data1]); }
function oncmd_gosub(func, event_id) { undef_func("oncmd_gosub", [func, event_id]); }
function onexit_goto(func) {
    window.onbeforeunload = func;
}
function onexit(data0) { undef_func("onexit", [data0]); }
function onkey(data0) { undef_func("onkey", [data0]); }
function palette(data0, data1, data2, data3 = null, data4 = null) { undef_func("palette", [data0, data1, data2, data3, data4]); }
function peek(string_data, index) {
    switch (string_data.split("")[index]) {
        case "1":
            return 49;
        case "2":
            return 50;
        case "3":
            return 51;
        case "4":
            return 52;
        case "5":
            return 53;
        case "6":
            return 54;
        case "7":
            return 55;
        case "8":
            return 56;
        case "9":
            return 57;
        case "x":
            return 120;
        case "y":
            return 121;
        case "z":
            return 122;
        case "#":
            return 35;
        case ".":
            return 46;
        case "^":
            return 94;
        case "I":
            return 73;
        case "a":
            return 97;
        case "b":
            return 98;
        case "c":
            return 99;
        case "d":
            return 100;
        case "e":
            return 101;
        case "f":
            return 102;
        case "g":
            return 103;
        case "h":
            return 104;
        case "i":
            return 105;
        case "j":
            return 106;
        case "k":
            return 107;
        case "l":
            return 108;
        default:
            undef_func("peek", [string_data, index]);
            undef_func("peek", [string_data.split("")[index]]);
            return index;
    }
}
function picload(img_name) {
    return __awaiter(this, void 0, void 0, function* () {
        let img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = "img/" + img_name + ".png";
        }).then(() => {
            canvases[target_window_id].width = img.width;
            canvases[target_window_id].height = img.height;
            contexts[target_window_id] = canvases[target_window_id].getContext('2d');
            contexts[target_window_id].drawImage(img, 0, 0);
        }).catch(() => {
            alert("データの読み込みに失敗しました。");
        });
    });
}
function poke(data0, data1, data2) { undef_func("poke", [data0, data1, data2]); }
function pos(x, y) {
    position = [x, y];
}
function pset(pos_x, pos_y) {
    context.beginPath();
    context.arc(pos_x, pos_y, 1, 0, 6.28, false);
    context.fill();
}
function randomize() { undef_func("randomize"); }
function redraw(mode) {
    mode = 1;
    if (mode == 1 && pre_render_canvas) {
        context = contexts[target_window_id];
        context.drawImage(pre_render_canvas, 0, 0);
    }
    else {
        pre_render_canvas = document.createElement('canvas');
        pre_render_canvas.id = "pre";
        pre_render_canvas.width = 340;
        pre_render_canvas.height = 340;
        context = pre_render_canvas.getContext('2d');
    }
}
function rnd(num) {
    return Math.floor(Math.random() * num);
}
function screen_(id, display_width, display_height, init_mode, pos_x = null, pos_y = null) {
    if (id == 0) {
        display_width = 340;
        display_height = 340;
    }
    buffer(id, display_width, display_height, init_mode);
    // canvases[id].style.top = pos_x;
    // canvases[id].style.left = pos_y;
    // canvasContainer.appendChild(canvases[id]);
    // canvases[id].style.display = "none";
}
function sendmsg(data0, data1, data2, data3) { undef_func("sendmsg", [data0, data1, data2, data3]); }
function sdim(length1, length2 = null, length3 = null) {
    if (length2 == null) {
        return "";
    }
    var return_list = [];
    for (var i = 0; i < length2; i++) {
        if (length3 != null) {
            return_list[i] = [];
            for (var j = 0; j < length3; j++) {
                return_list[i][j] = "";
            }
        }
        else {
            return_list[i] = "";
        }
    }
    return return_list;
}
function stick(data0, data1) { undef_func("stick", [data0, data1]); return 0; }
function strmid(data0, data1, data2) { undef_func("strmid", [data0, data1, data2]); }
function title(window_name) {
    if (target_window_id == 0) {
        document.title = window_name;
    }
}
function wait(time) {
    return new Promise((resolve, reject) => { setTimeout(() => resolve(), 10 * time); });
}
function width(data0, data1) { undef_func("width", [data0, data1]); }
function HMMINIT(data0) {
    stat = 1;
}
function DSLOADMEMORY(audio_data, audio_id) {
    se[audio_id] = audio_data;
}
function DSPLAY(audio_id = null) {
    if (!audio_id) {
        return;
    }
    playSound(se[audio_id], var_669 / 100);
}
function DSSETVOLUME(se_id, volume) { }
function DSGETMASTERVOLUME() { }
function DSSETMASTERVOLUME(data0) {
    currentBgm?.then(bgm => bgm.volume(var_61 / 100));
}
function DMINIT() { }
function DMLOADMEMORY(file_name, data0, data1) {
    currentBgm?.then(bgm => {
        bgm.stop();
        bgm.unload();
    });
    const path = "bgm/" + (isMobile ? "low/" : "") + file_name;
    currentBgm = loadSound(path, { loop: true });
    playSound(currentBgm, var_61 / 100);
}
function DMPLAY(data0, data1) { }
function DMSTOP() {
    currentBgm?.then(bgm => {
        bgm.stop();
        bgm.unload();
    });
}
function ck_joystick(data0, data1 = null) {
    return 0;
}
function netclose(data0, data1 = null, data2 = null, data3 = null) { }
function netfail(data0, data1 = null, data2 = null, data3 = null) { }
function netinit(data0, data1, data2, data3) { }
function tcpopen(data0, data1, data2) { }
function tcpiscon(data0) { }
function tcpcount(data0, data1) { }
function tcpgetl(data0, data1, data2) { }
function tcpput(data0, data1) { }
function GetWindowLongA(data1, data2) { }
function SetWindowLongA(data1, data2, data3) { }
function SetWindowPos(hwnd, data1, data2, data3, data4, data5, data6) { }
function ShowWindow(id, state) { }
function ImmGetContext(arg1) { }
function ImmSetOpenStatus(arg1, arg2) { }
function ImmReleaseContext(arg1, arg2) { }
function ImmGetOpenStatus(arg1) { }
