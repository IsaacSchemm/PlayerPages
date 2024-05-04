/// <reference path="hls-player.ts" />
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
var _this = this;
var player = ko.observable();
var menu = document.getElementById("menu");
if (wiiu) {
    var stop_1 = document.createElement("button");
    stop_1.innerText = "Close media player";
    stop_1.style.padding = "1em";
    stop_1.addEventListener("click", function (e) {
        e.preventDefault();
        wiiu.videoplayer.end();
    });
    var videoParent = document.getElementById("video-parent");
    videoParent.innerHTML = "";
    videoParent.appendChild(stop_1);
}
document.getElementById("debugLink").addEventListener("click", function (e) {
    e.preventDefault();
    if (document.body.parentElement.classList.contains("debug")) {
        document.body.parentElement.classList.remove("debug");
    }
    else {
        document.body.parentElement.classList.add("debug");
    }
});
ko.applyBindings({
    controllablePlayer: ko.pureComputed(function () {
        var pl = player();
        return pl && !pl.nativeControls() ? pl : null;
    })
}, document.getElementsByTagName("main")[0]);
var getContentTypeAsync = function (src) { return __awaiter(_this, void 0, void 0, function () {
    var resp, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fetch(src, {
                        method: "HEAD"
                    })];
            case 1:
                resp = _a.sent();
                if (resp.ok) {
                    return [2 /*return*/, resp.headers.get("Content-Type")];
                }
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.warn(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, null];
        }
    });
}); };
var loadMedia = function (src, contentType) {
    console.log(src, contentType);
    try {
        var oldPlayer = player();
        if (oldPlayer) {
            player(null);
            oldPlayer.destroy();
        }
        var video = document.createElement("video");
        video.src = src;
        var videoParent = document.getElementById("video-parent");
        videoParent.innerHTML = "";
        videoParent.appendChild(video);
        var isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
            || contentType.toLowerCase() == "application/x-mpegurl";
        var pl = isHLS
            ? new HLSPlayer(document.getElementsByTagName("main")[0], video, src)
            : new PPSPlayer(document.getElementsByTagName("main")[0], video);
        player(pl);
    }
    catch (e) {
        console.error(e);
    }
};
(function () { return __awaiter(_this, void 0, void 0, function () {
    var mediaLinks, first, _loop_1, i, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                mediaLinks = document.querySelectorAll("a[target=mediaframe]");
                first = true;
                _loop_1 = function (i) {
                    var mediaLink, contentType;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                mediaLink = mediaLinks[i];
                                if (!(mediaLink instanceof HTMLAnchorElement))
                                    return [2 /*return*/, "continue"];
                                console.log(mediaLink.href);
                                return [4 /*yield*/, getContentTypeAsync(mediaLink.href)];
                            case 1:
                                contentType = _b.sent();
                                if (contentType) {
                                    mediaLink.addEventListener("click", function (e) {
                                        if (!mediaLink.href)
                                            return;
                                        e.preventDefault();
                                        loadMedia(mediaLink.href, contentType);
                                    });
                                    if (first) {
                                        console.log("Automatically loading: ".concat(mediaLink.href));
                                        loadMedia(mediaLink.href, contentType);
                                        first = false;
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < mediaLinks.length)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.warn(e_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=main.js.map