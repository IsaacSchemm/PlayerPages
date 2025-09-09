class PPSPlayer {
    readonly playing = ko.observable(false);
    readonly live = ko.observable(false);
    readonly durationMs = ko.observable(0);
    readonly currentTimeMs = ko.observable(0);
    readonly vol = ko.observable(0);
    readonly muted = ko.observable(false);
    readonly canSelectAudioOutput = ko.observable("mediaDevices" in navigator && "selectAudioOutput" in navigator.mediaDevices);
    readonly canCast = ko.observable(false);
    readonly canAirPlay = ko.observable(false);
    readonly canFullscreen = ko.observable(false);
    readonly fullscreen = ko.observable(false);

    readonly hasSubtitles = ko.observable(false);
    readonly subtitlesActive = ko.observable(false);

    readonly mouseIdle = ko.observable(false);

    readonly levelPickerActive = ko.observable(false);
    readonly nativeControls = ko.observable(false);

    readonly levels = ko.observableArray<{ name: string, activate: () => void }>();

    readonly currentTimeStr = ko.pureComputed(() => {
        const milliseconds = this.currentTimeMs();

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

    readonly mediaElement: HTMLVideoElement;
    readonly onDestroy: () => void;

    constructor(
        readonly fullscreenElement: HTMLElement,
        readonly parentElement: HTMLElement,
        readonly src: string
    ) {
        // Clear player container
        parentElement.innerHTML = "";

        // Create video element
        const mediaElement = document.createElement("video");
        parentElement.appendChild(mediaElement);

        this.mediaElement = mediaElement;

        this.canFullscreen("requestFullscreen" in mediaElement);
        this.vol(mediaElement.volume);

        // Event listeners (update custom controls when media state changes)
        mediaElement.addEventListener("play", _ => {
            this.playing(true);
        });
        mediaElement.addEventListener("pause", _ => {
            this.playing(false);
        });
        mediaElement.addEventListener("durationchange", () => {
            this.durationMs(mediaElement.duration * 1000);
        });

        mediaElement.addEventListener("error", e => {
            console.error("Cast error", e);
        });

        mediaElement.addEventListener("timeupdate", _ => {
            this.updateInterface = true;
            this.currentTimeMs(mediaElement.currentTime * 1000);
            this.updateInterface = false;
        });
        mediaElement.addEventListener("volumechange", _ => {
            this.updateInterface = true;
            this.vol(mediaElement.volume);
            this.muted(mediaElement.muted);
            this.updateInterface = false;
        });

        // Listen for changes made to the seek / volume bars and update media
        this.currentTimeMs.subscribe(value => {
            if (this.updateInterface) return;
            mediaElement.currentTime = value / 1000;
        });
        this.vol.subscribe(value => {
            if (this.updateInterface) return;
            mediaElement.volume = value;
        });

        // Maintain state of full-screen button
        const onfullscreenchange = () => {
            this.fullscreen(document.fullscreenElement === fullscreenElement);
        };

        // Hide controls on mouse idle
        let mousewait = setTimeout(() => { }, 0);
        const onmousemove = () => {
            clearTimeout(mousewait);
            this.mouseIdle(false);
            mousewait = setTimeout(() => this.mouseIdle(true), 2000);
        };

        document.addEventListener("fullscreenchange", onfullscreenchange);
        document.addEventListener("mousemove", onmousemove);

        // Clean up event handlers when player is replaced
        this.onDestroy = () => {
            document.removeEventListener("fullscreenchange", onfullscreenchange);
        };

        // Google Cast
        if (PPS.cjs) {
            this.canCast(PPS.cjs.available);
            PPS.cjs.on("available", () => this.canCast(true));
        }

        // AirPlay
        if ("WebKitPlaybackTargetAvailabilityEvent" in window) {
            const handler = (e: any) => {
                this.canAirPlay(e.availability === "available");
                this.mediaElement.removeEventListener("webkitplaybacktargetavailabilitychanged", handler);
            };
            this.mediaElement.addEventListener("webkitplaybacktargetavailabilitychanged", handler);
        }

        this.mediaElement.src = src;
    }

    play() {
        this.mediaElement.play();
    }

    togglePlay() {
        if (this.mediaElement.paused) {
            this.mediaElement.play();
        } else {
            this.mediaElement.pause();
        }
    }

    back10() {
        this.mediaElement.currentTime = Math.max(
            0,
            this.mediaElement.currentTime - 10);
    }

    forward10() {
        this.mediaElement.currentTime = Math.min(
            this.mediaElement.duration,
            this.mediaElement.currentTime + 10);
    }

    back30() {
        this.mediaElement.currentTime = Math.max(
            0,
            this.mediaElement.currentTime - 30);
    }

    forward30() {
        this.mediaElement.currentTime = Math.min(
            this.mediaElement.duration,
            this.mediaElement.currentTime + 30);
    }

    toggleSubtitles() { }

    toggleMute() {
        this.mediaElement.muted = !this.mediaElement.muted;
    }

    volumeUp() {
        this.vol(
            Math.min(
                this.vol() * Math.pow(10, .3),
                1));
    }

    volumeDown() {
        this.vol(this.vol() / Math.pow(10, .3));
    }

    async selectAudioOutput() {
        try {
            const mediaDeviceInfo = await (navigator.mediaDevices as any).selectAudioOutput();
            this.mediaElement.setSinkId(mediaDeviceInfo.deviceId);
        } catch (e) {
            console.error(e);
        }
    }

    showLevelPicker() {
        this.levelPickerActive(true);
    }

    hideLevelPicker() {
        this.levelPickerActive(false);
    }

    activateCast() {
        if (PPS.cjs.available) {
            PPS.cjs.cast(this.src);
        }
    }

    activateAirPlay() {
        (this.mediaElement as any).webkitShowPlaybackTargetPicker();
    }

    toggleFullscreen() {
        if (document.fullscreenElement === this.fullscreenElement || document.fullscreenElement === this.mediaElement) {
            document.exitFullscreen();
        } else {
            this.fullscreenElement.requestFullscreen();
        }
    }

    enterNativeFullscreen() {
        this.mediaElement.controls = true;
        this.mediaElement.requestFullscreen();
    }

    destroy() {
        this.onDestroy();
    }
}