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
        this.nativeControls = ko.observable(false);
        this.showVolumeControls = ko.observable(false);
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
            alert("The media could not be played on this device.");
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
    }
    PPSPlayer.prototype.togglePlay = function () {
        if (this.mediaElement.paused) {
            this.mediaElement.play();
        }
        else {
            this.mediaElement.pause();
        }
    };
    PPSPlayer.prototype.toggleVolumeControls = function () {
        this.showVolumeControls(!this.showVolumeControls());
    };
    PPSPlayer.prototype.toggleMute = function () {
        this.mediaElement.muted = !this.mediaElement.muted;
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