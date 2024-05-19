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
        this.subtitleTracks = ko.observableArray();
        this.hasSubtitles = ko.pureComputed(function () { return _this.subtitleTracks().length > 0; });
        this.currentSubtitleTrack = ko.observable(null);
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
        // Allow user to toggle through subtitles with custom controls
        if (mediaElement.textTracks) {
            mediaElement.textTracks.addEventListener("addtrack", function (e) {
                _this.subtitleTracks.push(e.track);
            });
        }
        this.currentSubtitleTrack.subscribe(function (newValue) {
            for (var _i = 0, _a = _this.subtitleTracks(); _i < _a.length; _i++) {
                var track = _a[_i];
                track.mode = "hidden";
            }
            if (newValue)
                newValue.mode = "showing";
        });
        this.canCast(PPS.cjs.available);
        PPS.cjs.on("available", function () { return _this.canCast(true); });
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
    PPSPlayer.prototype.hideLevelPicker = function () {
        this.levelPickerActive(false);
    };
    PPSPlayer.prototype.activateCast = function () {
        // The plan is for this function to trigger Google Cast.
        // The code will need to detect that it's been enabled (from here or
        // from the browser) and replace the player with one that controls the
        // Chromecast device.
        if (PPS.cjs.available) {
            PPS.cjs.cast(this.src);
        }
    };
    PPSPlayer.prototype.activateAirPlay = function () {
        // This button should just show the Safari/iOS AirPlay dialog.
    };
    PPSPlayer.prototype.toggleFullscreen = function () {
        if (document.fullscreenElement === this.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            this.fullscreenElement.requestFullscreen();
        }
    };
    PPSPlayer.prototype.destroy = function () {
        this.onDestroy();
    };
    return PPSPlayer;
}());
