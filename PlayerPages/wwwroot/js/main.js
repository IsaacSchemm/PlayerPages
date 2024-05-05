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
ko.applyBindings({ player: player }, document.getElementsByTagName("main")[0]);
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
    try {
        // Clean up previous player (if any)
        var oldPlayer = player();
        if (oldPlayer) {
            player(null);
            oldPlayer.destroy();
        }
        // Create new HTML video player element and place it onto the page
        var video = document.createElement("video");
        var videoParent = document.getElementById("video-parent");
        videoParent.innerHTML = "";
        videoParent.appendChild(video);
        // Determine which JavaScript player to use
        var isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
            || contentType.toLowerCase() == "application/x-mpegurl";
        // If hls.js is not loaded or will not work, just use an HTML player
        // (may allow at least some versions of iOS to work)
        if ("Hls" in window && !Hls.isSupported())
            isHLS = false;
        // Initialize the player
        var pl = isHLS
            ? new HLSPlayer(document.getElementsByTagName("main")[0], video, src)
            : new HTMLPlayer(document.getElementsByTagName("main")[0], video, src);
        // Bind the player controls
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
                mediaLinks = document.querySelectorAll("a.media");
                first = true;
                _loop_1 = function (i) {
                    var mediaLink, src, contentType;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                mediaLink = mediaLinks[i];
                                if (!(mediaLink instanceof HTMLAnchorElement))
                                    return [2 /*return*/, "continue"];
                                src = mediaLink.getAttribute("data-src");
                                return [4 /*yield*/, getContentTypeAsync(src)];
                            case 1:
                                contentType = _b.sent();
                                if (contentType) {
                                    // We were able to confirm that this URL exists, and we know
                                    // its content type
                                    mediaLink.addEventListener("click", function (e) {
                                        e.preventDefault();
                                        // Close the menu
                                        document.getElementById("menu").removeAttribute("open");
                                        // Load the media
                                        loadMedia(src, contentType);
                                    });
                                    if (first) {
                                        // Load the media now
                                        console.log("Automatically loading: ".concat(mediaLink.href));
                                        loadMedia(src, contentType);
                                        // Do not automatically load any other media
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
                console.warn("Could not configure media link handlers", e_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
