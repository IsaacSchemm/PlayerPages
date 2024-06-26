var PPSPlayer = /** @class */ (function () {
    function PPSPlayer(fullscreenElement, parentElement, src) {
        var _this = this;
        this.fullscreenElement = fullscreenElement;
        this.parentElement = parentElement;
        this.src = src;
        this.playing = ko.observable(false);
        this.live = ko.observable(false);
        this.durationMs = ko.observable(0);
        this.currentTimeMs = ko.observable(0);
        this.vol = ko.observable(0);
        this.muted = ko.observable(false);
        this.canCast = ko.observable(false);
        this.canAirPlay = ko.observable(false);
        this.canFullscreen = ko.observable(false);
        this.fullscreen = ko.observable(false);
        this.hasSubtitles = ko.observable(false);
        this.subtitlesActive = ko.observable(false);
        this.mouseIdle = ko.observable(false);
        this.levelPickerActive = ko.observable(false);
        this.nativeControls = ko.observable(false);
        this.levels = ko.observableArray();
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
        // Clear player container
        parentElement.innerHTML = "";
        // Create video element
        var mediaElement = document.createElement("video");
        parentElement.appendChild(mediaElement);
        this.mediaElement = mediaElement;
        this.canFullscreen("requestFullscreen" in mediaElement);
        this.vol(mediaElement.volume);
        // Event listeners (update custom controls when media state changes)
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
            console.error("Cast error", e);
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
        // Listen for changes made to the seek / volume bars and update media
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
        // Maintain state of full-screen button
        var onfullscreenchange = function () {
            _this.fullscreen(document.fullscreenElement === fullscreenElement);
        };
        // Hide controls on mouse idle
        var mousewait = setTimeout(function () { }, 0);
        var onmousemove = function () {
            clearTimeout(mousewait);
            _this.mouseIdle(false);
            mousewait = setTimeout(function () { return _this.mouseIdle(true); }, 2000);
        };
        document.addEventListener("fullscreenchange", onfullscreenchange);
        document.addEventListener("mousemove", onmousemove);
        // Clean up event handlers when player is replaced
        this.onDestroy = function () {
            document.removeEventListener("fullscreenchange", onfullscreenchange);
        };
        // Google Cast
        if (PPS.cjs) {
            this.canCast(PPS.cjs.available);
            PPS.cjs.on("available", function () { return _this.canCast(true); });
        }
        // AirPlay
        if ("WebKitPlaybackTargetAvailabilityEvent" in window) {
            var handler_1 = function (e) {
                _this.canAirPlay(e.availability === "available");
                _this.mediaElement.removeEventListener("webkitplaybacktargetavailabilitychanged", handler_1);
            };
            this.mediaElement.addEventListener("webkitplaybacktargetavailabilitychanged", handler_1);
        }
        this.mediaElement.src = src;
    }
    PPSPlayer.prototype.play = function () {
        this.mediaElement.play();
    };
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
    PPSPlayer.prototype.toggleSubtitles = function () { };
    PPSPlayer.prototype.toggleMute = function () {
        this.mediaElement.muted = !this.mediaElement.muted;
    };
    PPSPlayer.prototype.volumeUp = function () {
        this.vol(Math.min(this.vol() * Math.pow(10, .3), 1));
    };
    PPSPlayer.prototype.volumeDown = function () {
        this.vol(this.vol() / Math.pow(10, .3));
    };
    PPSPlayer.prototype.showLevelPicker = function () {
        this.levelPickerActive(true);
    };
    PPSPlayer.prototype.hideLevelPicker = function () {
        this.levelPickerActive(false);
    };
    PPSPlayer.prototype.activateCast = function () {
        if (PPS.cjs.available) {
            PPS.cjs.cast(this.src);
        }
    };
    PPSPlayer.prototype.activateAirPlay = function () {
        this.mediaElement.webkitShowPlaybackTargetPicker();
    };
    PPSPlayer.prototype.toggleFullscreen = function () {
        if (document.fullscreenElement === this.fullscreenElement || document.fullscreenElement === this.mediaElement) {
            document.exitFullscreen();
        }
        else {
            this.fullscreenElement.requestFullscreen();
        }
    };
    PPSPlayer.prototype.enterNativeFullscreen = function () {
        this.mediaElement.controls = true;
        this.mediaElement.requestFullscreen();
    };
    PPSPlayer.prototype.destroy = function () {
        this.onDestroy();
    };
    return PPSPlayer;
}());
