class PPSPlayer {
    readonly playing = ko.observable(false);
    readonly live = ko.observable(false);
    readonly durationMs = ko.observable(0);
    readonly currentTimeMs = ko.observable(0);
    readonly vol = ko.observable(0);
    readonly muted = ko.observable(false);
    readonly fullscreen = ko.observable(false);

    readonly nativeControls = ko.observable(false);

    readonly showVolumeControls = ko.observable(false);

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

    readonly onDestroy: () => void;

    constructor(
        readonly mainElement: HTMLElement,
        readonly mediaElement: HTMLMediaElement
    ) {
        this.vol(mediaElement.volume);

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
            console.error(e);
            alert("The media could not be played on this device.");
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

        this.currentTimeMs.subscribe(value => {
            if (this.updateInterface) return;
            mediaElement.currentTime = value / 1000;
        });
        this.vol.subscribe(value => {
            if (this.updateInterface) return;
            mediaElement.volume = value;
        });

        const onfullscreenchange = () => {
            this.fullscreen(document.fullscreenElement === mainElement);
        };
        const onmousemove = () => {
            this.nativeControls(mediaElement.controls);
            this.fullscreen(document.fullscreenElement === mainElement);
        };

        document.addEventListener("fullscreenchange", onfullscreenchange);
        mediaElement.addEventListener("mousemove", onmousemove);

        this.onDestroy = () => {
            document.removeEventListener("fullscreenchange", onfullscreenchange);
            mediaElement.removeEventListener("mousemove", onmousemove);
        };
    }

    togglePlay() {
        if (this.mediaElement.paused) {
            this.mediaElement.play();
        } else {
            this.mediaElement.pause();
        }
    }

    toggleVolumeControls() {
        this.showVolumeControls(!this.showVolumeControls());
    }

    toggleMute() {
        this.mediaElement.muted = !this.mediaElement.muted;
    }

    toggleFullscreen() {
        if (document.fullscreenElement === this.mainElement) {
            document.exitFullscreen();
        } else {
            this.mainElement.requestFullscreen();
        }
    }

    destroy() {
        this.onDestroy();
    }
}