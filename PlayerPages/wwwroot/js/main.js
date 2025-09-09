/// <reference path="knockout.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PPS;
(function (PPS) {
    var _this = this;
    PPS.cjs = typeof Castjs === "function"
        ? new Castjs()
        : null;
    if (PPS.cjs) {
        PPS.cjs.on("connect", function () { return PPS.casting(true); });
        PPS.cjs.on("disconnect", function () { return PPS.casting(false); });
    }
    PPS.casting = ko.observable(PPS.cjs === null || PPS.cjs === void 0 ? void 0 : PPS.cjs.connected);
    var player = ko.observable();
    PPS.casting.subscribe(function () {
        var pl = player();
        if (!pl)
            return;
        loadMedia(pl.src);
    });
    ko.applyBindings({
        player: player,
        idle: ko.pureComputed(function () {
            var pl = player();
            return pl && pl.mouseIdle() && pl.playing();
        }),
        paused: ko.pureComputed(function () {
            var pl = player();
            return pl ? !pl.playing() : false;
        }),
        play: function () {
            var pl = player();
            if (pl) {
                pl.play();
            }
        }
    }, document.getElementsByTagName("main")[0]);
    var getContentTypeAsync = function (src) { return __awaiter(_this, void 0, void 0, function () {
        var resp, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(src, { method: "HEAD" })];
                case 1:
                    resp = _a.sent();
                    if (resp && resp.ok)
                        return [2 /*return*/, resp.headers.get("Content-Type")];
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, "application/octet-stream"];
            }
        });
    }); };
    var isHlsAsync = function (src) { return __awaiter(_this, void 0, void 0, function () {
        var contentType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Hls.isSupported())
                        return [2 /*return*/, false];
                    return [4 /*yield*/, getContentTypeAsync(src)];
                case 1:
                    contentType = _a.sent();
                    return [2 /*return*/, /^application\/(vnd.apple.mpegurl|x-mpegurl)$/i.test(contentType)];
            }
        });
    }); };
    PPS.selectPlayerTypeAsync = function (src) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!PPS.casting()) return [3 /*break*/, 1];
                    return [2 /*return*/, CastjsPlayer];
                case 1: return [4 /*yield*/, isHlsAsync(src)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/, HLSPlayer];
                    else
                        return [2 /*return*/, PPSPlayer];
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var loadMedia = function (src) { return __awaiter(_this, void 0, void 0, function () {
        var oldPlayer, oldSrc, oldTime, PlayerClass, pl_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    oldPlayer = player();
                    oldSrc = oldPlayer === null || oldPlayer === void 0 ? void 0 : oldPlayer.src;
                    oldTime = oldPlayer === null || oldPlayer === void 0 ? void 0 : oldPlayer.currentTimeMs();
                    if (oldPlayer) {
                        player(null);
                        oldPlayer.destroy();
                    }
                    return [4 /*yield*/, PPS.selectPlayerTypeAsync(src)];
                case 1:
                    PlayerClass = _a.sent();
                    pl_1 = new PlayerClass(document.getElementsByTagName("main")[0], document.getElementById("video-parent"), src);
                    // Bind the player controls
                    player(pl_1);
                    if (!(pl_1.src === oldSrc)) return [3 /*break*/, 5];
                    // Request autoplay in this situation
                    pl_1.play();
                    _a.label = 2;
                case 2:
                    if (!!pl_1.playing()) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (r) { return pl_1.playing.subscribe(function () { return r(); }); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    // Seek to the same timestamp that the player was at previously
                    pl_1.currentTimeMs(oldTime);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // These media links were placed on the page, and currently are just
    // normal links to the media URLs.
    // Loop through these links, and then attach click handlers so the links
    // open the video on the page itself, instead.
    var mediaLinks = document.querySelectorAll("a.media");
    var _loop_1 = function (i) {
        var mediaLink = mediaLinks[i];
        mediaLink.addEventListener("click", function (e) {
            e.preventDefault();
            // Close the menu
            document.getElementById("menu").removeAttribute("open");
            // Load the media
            loadMedia(mediaLinks[i].getAttribute("href"));
        });
    };
    for (var i = 0; i < mediaLinks.length; i++) {
        _loop_1(i);
    }
    if (mediaLinks.length > 0) {
        loadMedia(mediaLinks[0].getAttribute("href"));
    }
})(PPS || (PPS = {}));
