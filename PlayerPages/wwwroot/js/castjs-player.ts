class CastjsPlayer {
    readonly playing = ko.observable(false);
    readonly live = ko.pureComputed(() => this.durationMs() === -1);
    readonly durationMs = ko.observable(0);
    readonly currentTimeMs = ko.observable<string | number>(0);
    readonly vol = ko.observable<string | number>(0);
    readonly muted = ko.observable(false);
    readonly canCast = ko.observable(true);
    readonly canAirPlay = ko.observable(false);
    readonly canFullscreen = ko.observable(false);
    readonly fullscreen = ko.observable(false);

    readonly hasSubtitles = ko.observable(false);
    readonly subtitlesActive = ko.observable(false);
    readonly subtitlesIndex = ko.observable(-1);

    readonly mouseIdle = ko.observable(false);

    readonly levelPickerActive = ko.observable(false);
    readonly nativeControls = ko.observable(false);

    readonly levels = ko.observableArray<never>();

    readonly currentTimeStr = ko.pureComputed(() => {
        const milliseconds = +this.currentTimeMs();

        let h = Math.floor(milliseconds / 3600000);
        let m = Math.floor(milliseconds / 60000) % 60;
        let s = Math.floor(milliseconds / 1000) % 60;

        m += 100;
        s += 100;

        return [
            `${h}`,
            `${m}`.substring(1, 3),
            `${s}`.substring(1, 3)
        ].join(":");
    });

    readonly durationStr = ko.pureComputed(() => {
        const milliseconds = this.durationMs();

        let h = Math.floor(milliseconds / 3600000);
        let m = Math.floor(milliseconds / 60000) % 60;
        let s = Math.floor(milliseconds / 1000) % 60;

        m += 100;
        s += 100;

        return [
            `${h}`,
            `${m}`.substring(1, 3),
            `${s}`.substring(1, 3)
        ].join(":");
    });

    private updateInterface = false;

    constructor(
        readonly fullscreenElement: HTMLElement,
        readonly parentElement: HTMLElement,
        readonly src?: string
    ) {
        // Clear player container
        parentElement.innerHTML = "";

        if (src != null && PPS.cjs.src !== src) {
            PPS.cjs.cast(src);
        }

        this.vol(PPS.cjs.volumeLevel);

        // Event listeners (update custom controls when media state changes)
        PPS.cjs.on("playing", _ => {
            this.playing(true);
            this.hasSubtitles(PPS.cjs.subtitles.length > 0);
        });
        PPS.cjs.on("pause", _ => {
            this.playing(false);
        });
        PPS.cjs.on("end", _ => {
            this.playing(false);
        });

        PPS.cjs.on("error", e => {
            console.error(e);
        });

        PPS.cjs.on("timeupdate", _ => {
            this.updateInterface = true;
            this.currentTimeMs(PPS.cjs.time * 1000);
            this.durationMs(PPS.cjs.duration * 1000);
            this.updateInterface = false;
        });
        PPS.cjs.on("volumechange", _ => {
            this.updateInterface = true;
            this.vol(PPS.cjs.volumeLevel);
            this.updateInterface = false;
        });
        PPS.cjs.on("mute", _ => {
            this.updateInterface = true;
            this.muted(PPS.cjs.muted);
            this.updateInterface = false;
        });
        PPS.cjs.on("unmute", _ => {
            this.updateInterface = true;
            this.muted(PPS.cjs.muted);
            this.updateInterface = false;
        });

        // Listen for changes made to the seek / volume bars and update media
        this.currentTimeMs.subscribe(value => {
            if (this.updateInterface) return;
            PPS.cjs.seek(+value / 1000);
        });
        this.vol.subscribe(value => {
            if (this.updateInterface) return;
            PPS.cjs.volume(+value);
        });
    }

    play() {
        PPS.cjs.play();
    }

    togglePlay() {
        if (this.playing()) {
            PPS.cjs.pause();
        } else {
            PPS.cjs.play();
        }
    }

    back10() {
        PPS.cjs.seek(Math.max(
            0,
            PPS.cjs.time - 10));
    }

    forward10() {
        PPS.cjs.seek(Math.min(
            PPS.cjs.duration,
            PPS.cjs.time + 10));
    }

    back30() {
        PPS.cjs.seek(Math.max(
            0,
            PPS.cjs.time - 30));
    }

    forward30() {
        PPS.cjs.seek(Math.min(
            PPS.cjs.duration,
            PPS.cjs.time + 30));
    }

    toggleSubtitles() {
        let index = this.subtitlesIndex();
        console.log({ index })
        index++;
        console.log({ index })
        if (index >= PPS.cjs.subtitles.length) {
            index = -1;
        }
        console.log({index})
        PPS.cjs.subtitle(index);
    }

    toggleMute() {
        if (this.muted()) {
            PPS.cjs.unmute();
        } else {
            PPS.cjs.mute();
        }
    }

    volumeUp() {
        this.vol(
            Math.min(
                +this.vol() * Math.pow(10, .3),
                1));
    }

    volumeDown() {
        this.vol(+this.vol() / Math.pow(10, .3));
    }

    showLevelPicker() { }

    hideLevelPicker() { }

    activateCast() {
        PPS.cjs.disconnect();
    }

    activateAirPlay() { }

    toggleFullscreen() { }

    enterNativeFullscreen() { }

    destroy() { }
}