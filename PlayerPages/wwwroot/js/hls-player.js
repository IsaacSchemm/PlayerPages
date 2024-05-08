var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HLSPlayer = /** @class */ (function (_super) {
    __extends(HLSPlayer, _super);
    function HLSPlayer(mainElement, parentElement, src) {
        var _this = _super.call(this, mainElement, parentElement, src) || this;
        _this.mainElement = mainElement;
        _this.parentElement = parentElement;
        _this.src = src;
        _this.levels([{
                name: "Automatic",
                activate: function () {
                    _this.hls.selectedLevel = -1;
                    _this.hideLevelPicker();
                }
            }]);
        _this.hls = new Hls();
        _this.hls.attachMedia(_this.mediaElement);
        _this.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            _this.hls.loadSource(src);
            _this.hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
                var i = 0;
                var _loop_1 = function (level) {
                    var index = i;
                    _this.levels.push({
                        name: "".concat(Math.ceil(level.bitrate / 1024), " Kbps (").concat(level.width, "x").concat(level.height, ")"),
                        activate: function () {
                            _this.hls.currentLevel = index;
                            _this.hideLevelPicker();
                        }
                    });
                    i++;
                };
                for (var _i = 0, _a = data.levels; _i < _a.length; _i++) {
                    var level = _a[_i];
                    _loop_1(level);
                }
            });
            _this.hls.on(Hls.Events.LEVEL_UPDATED, function (_, data) {
                if (data.details.live) {
                    _this.live(true);
                }
            });
            _this.playing.subscribe(function (newValue) {
                if (newValue === true) {
                    if (_this.mediaElement.currentTime < _this.hls.liveSyncPosition) {
                        _this.mediaElement.currentTime = _this.hls.liveSyncPosition;
                    }
                }
            });
        });
        return _this;
    }
    HLSPlayer.prototype.destroy = function () {
        this.hls.destroy();
        _super.prototype.destroy.call(this);
    };
    return HLSPlayer;
}(PPSPlayer));
