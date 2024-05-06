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
var PPSMain;
(function (PPSMain) {
    var _this = this;
    var player = ko.observable();
    ko.applyBindings({ player: player }, document.getElementsByTagName("main")[0]);
    var delay = function (ms) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (r) { return setTimeout(r, ms); })];
        });
    }); };
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
    var loadMedia = function (src, contentType) {
        // Called when the user selects a media link from the menu (if handlers
        // are set up); may be called on page load for the first media link.
        try {
            // Clean up previous player (if any)
            var oldPlayer = player();
            if (oldPlayer) {
                player(null);
                oldPlayer.destroy();
            }
            // Clear player container
            var videoParent = document.getElementById("video-parent");
            videoParent.innerHTML = "";
            // Create play button
            // Appears when the player is paused (including initally)
            var playButton_1 = document.createElement("button");
            playButton_1.id = "play-button";
            playButton_1.innerHTML = "<span class=\"material-icons\" aria-hidden=\"true\">play_arrow</span>";
            videoParent.appendChild(playButton_1);
            // Put the play button on its own line (only matters for fallback CSS)
            videoParent.appendChild(document.createElement("div"));
            // Create video element
            var video_1 = document.createElement("video");
            videoParent.appendChild(video_1);
            // Determine which JavaScript player to use
            var isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
                || contentType.toLowerCase() == "application/x-mpegurl";
            // If hls.js is not loaded or will not work, just use an HTML player
            if (!("Hls" in window) || !Hls.isSupported())
                isHLS = false;
            // Initialize the player
            var pl = isHLS
                ? new HLSPlayer(document.getElementsByTagName("main")[0], video_1, src)
                : new HTMLPlayer(document.getElementsByTagName("main")[0], video_1, src);
            // Set up play button
            pl.playing.subscribe(function (newValue) {
                playButton_1.style.visibility = newValue ? "hidden" : "";
            });
            playButton_1.addEventListener("click", function (e) {
                e.preventDefault();
                video_1.play();
            });
            // Bind the player controls
            player(pl);
        }
        catch (e) {
            console.error(e);
        }
    };
    function attachHandlerAsync(mediaLink, autoload) {
        return __awaiter(this, void 0, void 0, function () {
            var contentType_1, http, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, getContentTypeAsync(mediaLink.href)];
                    case 1:
                        contentType_1 = _a.sent();
                        if (!!contentType_1) return [3 /*break*/, 3];
                        http = mediaLink.href
                            .replace(/^https:\/\/([^\/:]+\.streamlock\.net)\//, "http://$1:1935/")
                            .replace(/^https:\/\/([^\/:]+)\//, "http://$1/");
                        if (!(http != mediaLink.href)) return [3 /*break*/, 3];
                        return [4 /*yield*/, getContentTypeAsync(http)];
                    case 2:
                        contentType_1 = _a.sent();
                        if (contentType_1) {
                            mediaLink.href = http;
                            mediaLink.innerText += " (HTTP)";
                        }
                        _a.label = 3;
                    case 3:
                        // If we couldn't access this media and determine its type, then just
                        // leave the link as-is
                        if (!contentType_1)
                            return [2 /*return*/];
                        mediaLink.addEventListener("click", function (e) {
                            e.preventDefault();
                            // Close the menu
                            document.getElementById("menu").removeAttribute("open");
                            // Load the media
                            loadMedia(mediaLink.href, contentType_1);
                        });
                        // The first media in the list should be loaded automatically
                        if (autoload) {
                            loadMedia(mediaLink.href, contentType_1);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.warn("Could not configure media link handler", e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
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
})(PPSMain || (PPSMain = {}));
