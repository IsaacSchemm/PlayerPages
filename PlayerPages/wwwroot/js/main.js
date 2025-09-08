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
        loadMedia(pl.src, pl instanceof HLSPlayer ? "hls" : "unknown");
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
                    console.log("Could not determine content type of remote media at ".concat(src), e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    }); };
    var loadMedia = function (src, format) {
        // Called when the user selects a media link from the menu (if handlers
        // are set up); may be called on page load for the first media link.
        try {
            // Clean up previous player (if any)
            var oldPlayer = player();
            // Store old player's source and seek time
            var oldSrc = oldPlayer === null || oldPlayer === void 0 ? void 0 : oldPlayer.src;
            var oldTime_1 = oldPlayer === null || oldPlayer === void 0 ? void 0 : oldPlayer.currentTimeMs();
            if (oldPlayer) {
                player(null);
                oldPlayer.destroy();
            }
            // Initialize the player
            var pl_1 = PPS.casting()
                ? new CastjsPlayer(document.getElementsByTagName("main")[0], document.getElementById("video-parent"), src)
                : format === "hls" && "Hls" in window && Hls.isSupported()
                    ? new HLSPlayer(document.getElementsByTagName("main")[0], document.getElementById("video-parent"), src)
                    : new PPSPlayer(document.getElementsByTagName("main")[0], document.getElementById("video-parent"), src);
            // Bind the player controls
            player(pl_1);
            // If it's the same media as before, try to seek to the same point
            // (for better Google Cast experience)
            if (pl_1.src === oldSrc) {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 4, , 5]);
                                // Request autoplay in this situation
                                pl_1.play();
                                _a.label = 1;
                            case 1:
                                if (!!pl_1.playing()) return [3 /*break*/, 3];
                                return [4 /*yield*/, new Promise(function (r) { return pl_1.playing.subscribe(function () { return r(); }); })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 1];
                            case 3:
                                // Seek to the same timestamp that the player was at previously
                                pl_1.currentTimeMs(oldTime_1);
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                console.warn(e_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); })();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    function attachHandlerAsync(mediaLink, autoload) {
        return __awaiter(this, void 0, void 0, function () {
            var contentType_1, isHLS, format_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getContentTypeAsync(mediaLink.href)];
                    case 1:
                        contentType_1 = _a.sent();
                        isHLS = (contentType_1 === null || contentType_1 === void 0 ? void 0 : contentType_1.toLowerCase()) === "application/vnd.apple.mpegurl"
                            || (contentType_1 === null || contentType_1 === void 0 ? void 0 : contentType_1.toLowerCase()) == "application/x-mpegurl";
                        format_1 = isHLS ? "hls" : "unknown";
                        mediaLink.addEventListener("click", function (e) {
                            // If we couldn't access this media and determine its type,
                            // just take the default link action of opening in a new tab,
                            // unless Google Cast is already active
                            if (!contentType_1 && !PPS.casting())
                                return;
                            e.preventDefault();
                            // Close the menu
                            document.getElementById("menu").removeAttribute("open");
                            // Load the media
                            loadMedia(mediaLink.href, format_1);
                        });
                        // The first media in the list should be loaded automatically
                        if (contentType_1 && autoload) {
                            loadMedia(mediaLink.href, format_1);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.warn("Could not configure media link handler", e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // These media links were placed on the page, and currently are just
    // normal links to the media URLs.
    // Loop through these links, see if we can fetch their URLs, and then
    // attach click handlers so the links open the video on the page
    // itself, instead.
    var mediaLinks = document.querySelectorAll("a.media");
    for (var i = 0; i < mediaLinks.length; i++) {
        var mediaLink = mediaLinks[i];
        if (!(mediaLink instanceof HTMLAnchorElement))
            continue;
        attachHandlerAsync(mediaLink, i == 0);
    }
})(PPS || (PPS = {}));
