var PPSPlayer = /** @class */ (function () {
    function PPSPlayer(mainElement, mediaElement) {
        var _this = this;
        this.mainElement = mainElement;
        this.mediaElement = mediaElement;
        this.playing = ko.observable(false);
        this.live = ko.observable(false);
        this.durationMs = ko.observable(0);
        this.currentTimeMs = ko.observable(0);
        this.vol = ko.observable(0);
        this.muted = ko.observable(false);
        this.fullscreen = ko.observable(false);
        this.subtitleTracks = ko.observableArray();
        this.hasSubtitles = ko.pureComputed(function () { return _this.subtitleTracks().length > 0; });
        this.currentSubtitleTrack = ko.observable(null);
        this.levelPickerActive = ko.observable(false);
        this.nativeControls = ko.observable(false);
        this.levels = ko.observableArray();
        this.levelButtons = ko.pureComputed(function () {
            var arr = [];
            var _loop_1 = function (level) {
                arr.push({
                    activate: function () {
                        level.onSelect();
                        _this.mediaElement.play();
                        _this.levelPickerActive(false);
                    },
                    name: level.name
                });
            };
            for (var _i = 0, _a = _this.levels(); _i < _a.length; _i++) {
                var level = _a[_i];
                _loop_1(level);
            }
            return arr;
        });
        this.currentTimeStr = ko.pureComputed(function () {
            var milliseconds = _this.currentTimeMs();
            var h = Math.floor(milliseconds / 3600000);
            var m = Math.floor(milliseconds / 60000) % 60;
            var s = Math.floor(milliseconds / 1000) % 60;
            m += 100;
            s += 100;
            return [
                "".concat(h),
                "".concat(m).substring(1, 3),
                "".concat(s).substring(1, 3)
            ].join(":");
        });
        this.durationStr = ko.pureComputed(function () {
            var milliseconds = _this.durationMs();
            var h = Math.floor(milliseconds / 3600000);
            var m = Math.floor(milliseconds / 60000) % 60;
            var s = Math.floor(milliseconds / 1000) % 60;
            m += 100;
            s += 100;
            return [
                "".concat(h),
                "".concat(m).substring(1, 3),
                "".concat(s).substring(1, 3)
            ].join(":");
        });
        this.updateInterface = false;
        this.vol(mediaElement.volume);
        mediaElement.addEventListener("play", function (_) {
            _this.playing(true);
        });
        mediaElement.addEventListener("pause", function (_) {
            _this.playing(false);
        });
        mediaElement.addEventListener("durationchange", function () {
            _this.durationMs(mediaElement.duration * 1000);
        });
        mediaElement.addEventListener("error", function (e) {
            console.error(e);
        });
        mediaElement.addEventListener("timeupdate", function (_) {
            _this.updateInterface = true;
            _this.currentTimeMs(mediaElement.currentTime * 1000);
            _this.updateInterface = false;
        });
        mediaElement.addEventListener("volumechange", function (_) {
            _this.updateInterface = true;
            _this.vol(mediaElement.volume);
            _this.muted(mediaElement.muted);
            _this.updateInterface = false;
        });
        this.currentTimeMs.subscribe(function (value) {
            if (_this.updateInterface)
                return;
            mediaElement.currentTime = value / 1000;
        });
        this.vol.subscribe(function (value) {
            if (_this.updateInterface)
                return;
            mediaElement.volume = value;
        });
        var onfullscreenchange = function () {
            _this.fullscreen(document.fullscreenElement === mainElement);
        };
        var onmousemove = function () {
            _this.nativeControls(mediaElement.controls);
            _this.fullscreen(document.fullscreenElement === mainElement);
        };
        document.addEventListener("fullscreenchange", onfullscreenchange);
        mediaElement.addEventListener("mousemove", onmousemove);
        this.onDestroy = function () {
            document.removeEventListener("fullscreenchange", onfullscreenchange);
            mediaElement.removeEventListener("mousemove", onmousemove);
        };
        this.mediaElement.textTracks.addEventListener("addtrack", function (e) {
            _this.subtitleTracks.push(e.track);
        });
        this.currentSubtitleTrack.subscribe(function (newValue) {
            for (var _i = 0, _a = _this.subtitleTracks(); _i < _a.length; _i++) {
                var track = _a[_i];
                track.mode = "hidden";
            }
            if (newValue)
                newValue.mode = "showing";
        });
    }
    PPSPlayer.prototype.togglePlay = function () {
        if (this.mediaElement.paused) {
            this.mediaElement.play();
        }
        else {
            this.mediaElement.pause();
        }
    };
    PPSPlayer.prototype.back10 = function () {
        this.mediaElement.currentTime = Math.max(0, this.mediaElement.currentTime - 10);
    };
    PPSPlayer.prototype.forward10 = function () {
        this.mediaElement.currentTime = Math.min(this.mediaElement.duration, this.mediaElement.currentTime + 10);
    };
    PPSPlayer.prototype.back30 = function () {
        this.mediaElement.currentTime = Math.max(0, this.mediaElement.currentTime - 30);
    };
    PPSPlayer.prototype.forward30 = function () {
        this.mediaElement.currentTime = Math.min(this.mediaElement.duration, this.mediaElement.currentTime + 30);
    };
    PPSPlayer.prototype.toggleSubtitles = function () {
        var currentTrack = this.currentSubtitleTrack();
        var index = currentTrack
            ? this.subtitleTracks().indexOf(currentTrack)
            : -1;
        index++;
        if (index == this.subtitleTracks().length)
            index = -1;
        this.currentSubtitleTrack(index === -1
            ? null
            : this.subtitleTracks()[index]);
    };
    PPSPlayer.prototype.toggleMute = function () {
        this.mediaElement.muted = !this.mediaElement.muted;
    };
    PPSPlayer.prototype.showLevelPicker = function () {
        this.levelPickerActive(true);
    };
    PPSPlayer.prototype.toggleFullscreen = function () {
        if (document.fullscreenElement === this.mainElement) {
            document.exitFullscreen();
        }
        else {
            this.mainElement.requestFullscreen();
        }
    };
    PPSPlayer.prototype.destroy = function () {
        this.onDestroy();
    };
    return PPSPlayer;
}());
//# sourceMappingURL=pps-player.js.map