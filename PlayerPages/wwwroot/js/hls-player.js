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
    function HLSPlayer(mainElement, mediaElement, src) {
        var _this = _super.call(this, mainElement, mediaElement) || this;
        _this.mainElement = mainElement;
        _this.mediaElement = mediaElement;
        _this.src = src;
        _this.hls = new Hls();
        _this.hls.attachMedia(mediaElement);
        _this.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            _this.hls.loadSource(src);
            _this.hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
            });
            _this.hls.on(Hls.Events.LEVEL_LOADED, function (data) {
                if (data.details.live) {
                    _this.live(true);
                }
            });
            _this.hls.on(Hls.Events.LEVEL_UPDATED, function (_, data) {
                console.log(data.details);
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
//# sourceMappingURL=hls-player.js.map