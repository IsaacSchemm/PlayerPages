var CastjsPlayer = /** @class */ (function () {
    function CastjsPlayer(fullscreenElement, parentElement, src) {
        var _this = this;
        this.fullscreenElement = fullscreenElement;
        this.parentElement = parentElement;
        this.src = src;
        this.playing = ko.observable(false);
        this.live = ko.pureComputed(function () { return _this.durationMs() === -1; });
        this.durationMs = ko.observable(0);
        this.currentTimeMs = ko.observable(0);
        this.vol = ko.observable(0);
        this.muted = ko.observable(false);
        this.canCast = ko.observable(true);
        this.canAirPlay = ko.observable(false);
        this.canFullscreen = ko.observable(false);
        this.fullscreen = ko.observable(false);
        this.hasSubtitles = ko.observable(false);
        this.subtitlesActive = ko.observable(false);
        this.subtitlesIndex = ko.observable(-1);
        this.mouseIdle = ko.observable(false);
        this.levelPickerActive = ko.observable(false);
        this.nativeControls = ko.observable(false);
        this.levels = ko.observableArray();
        this.currentTimeStr = ko.pureComputed(function () {
            var milliseconds = +_this.currentTimeMs();
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
        if (src != null && PPS.cjs.src !== src) {
            PPS.cjs.cast(src);
        }
        this.vol(PPS.cjs.volumeLevel);
        // Event listeners (update custom controls when media state changes)
        PPS.cjs.on("playing", function (_) {
            _this.playing(true);
            _this.hasSubtitles(PPS.cjs.subtitles.length > 0);
        });
        PPS.cjs.on("pause", function (_) {
            _this.playing(false);
        });
        PPS.cjs.on("end", function (_) {
            _this.playing(false);
        });
        PPS.cjs.on("error", function (e) {
            console.error(e);
        });
        PPS.cjs.on("timeupdate", function (_) {
            _this.updateInterface = true;
            _this.currentTimeMs(PPS.cjs.time * 1000);
            _this.durationMs(PPS.cjs.duration * 1000);
            _this.updateInterface = false;
        });
        PPS.cjs.on("volumechange", function (_) {
            _this.updateInterface = true;
            _this.vol(PPS.cjs.volumeLevel);
            _this.updateInterface = false;
        });
        PPS.cjs.on("mute", function (_) {
            _this.updateInterface = true;
            _this.muted(PPS.cjs.muted);
            _this.updateInterface = false;
        });
        PPS.cjs.on("unmute", function (_) {
            _this.updateInterface = true;
            _this.muted(PPS.cjs.muted);
            _this.updateInterface = false;
        });
        // Listen for changes made to the seek / volume bars and update media
        this.currentTimeMs.subscribe(function (value) {
            if (_this.updateInterface)
                return;
            PPS.cjs.seek(+value / 1000);
        });
        this.vol.subscribe(function (value) {
            if (_this.updateInterface)
                return;
            PPS.cjs.volume(+value);
        });
    }
    CastjsPlayer.prototype.play = function () {
        PPS.cjs.play();
    };
    CastjsPlayer.prototype.togglePlay = function () {
        if (this.playing()) {
            PPS.cjs.pause();
        }
        else {
            PPS.cjs.play();
        }
    };
    CastjsPlayer.prototype.back10 = function () {
        PPS.cjs.seek(Math.max(0, PPS.cjs.time - 10));
    };
    CastjsPlayer.prototype.forward10 = function () {
        PPS.cjs.seek(Math.min(PPS.cjs.duration, PPS.cjs.time + 10));
    };
    CastjsPlayer.prototype.back30 = function () {
        PPS.cjs.seek(Math.max(0, PPS.cjs.time - 30));
    };
    CastjsPlayer.prototype.forward30 = function () {
        PPS.cjs.seek(Math.min(PPS.cjs.duration, PPS.cjs.time + 30));
    };
    CastjsPlayer.prototype.toggleSubtitles = function () {
        var index = this.subtitlesIndex();
        console.log({ index: index });
        index++;
        console.log({ index: index });
        if (index >= PPS.cjs.subtitles.length) {
            index = -1;
        }
        console.log({ index: index });
        PPS.cjs.subtitle(index);
    };
    CastjsPlayer.prototype.toggleMute = function () {
        if (this.muted()) {
            PPS.cjs.unmute();
        }
        else {
            PPS.cjs.mute();
        }
    };
    CastjsPlayer.prototype.showLevelPicker = function () { };
    CastjsPlayer.prototype.hideLevelPicker = function () { };
    CastjsPlayer.prototype.activateCast = function () {
        PPS.cjs.disconnect();
    };
    CastjsPlayer.prototype.activateAirPlay = function () { };
    CastjsPlayer.prototype.toggleFullscreen = function () { };
    CastjsPlayer.prototype.destroy = function () { };
    return CastjsPlayer;
}());
