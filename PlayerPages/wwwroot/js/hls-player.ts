//import Hls from "../lib/hls.js/hls.js";
declare var Hls: any;

type HLSLevel = { bitrate: number, height: number, width: number };

class HLSPlayer extends PPSPlayer {
    readonly hls: any;

    readonly levels = ko.observableArray<{ bitrate: number, height: number, width: number }>();

    readonly levelButtons = ko.pureComputed(() => {
        const arr = [{
            activate: () => this.playWithLevel(-1),
            name: `Automatic`
        }];
        let i = 0;
        for (const level of this.levels()) {
            const index = i;
            arr.push({
                activate: () => this.playWithLevel(index),
                name: `${Math.ceil(level.bitrate/1024)} Kbps (${level.width}x${level.height})`
            });
            i++;
        }
        return arr;
    });

    constructor(
        readonly mainElement: HTMLElement,
        readonly mediaElement: HTMLMediaElement,
        readonly src: string
    ) {
        super(mainElement, mediaElement);

        this.hls = new Hls();
        this.hls.attachMedia(mediaElement);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            this.hls.loadSource(src);

            this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                this.levels(data.levels);
                this.showLevelPicker(true);
            });
            this.hls.on(Hls.Events.LEVEL_UPDATED, (_, data) => {
                if (data.details.live) {
                    this.live(true);
                }
            });

            this.playing.subscribe(newValue => {
                if (newValue === true) {
                    if (this.mediaElement.currentTime < this.hls.liveSyncPosition) {
                        this.mediaElement.currentTime = this.hls.liveSyncPosition;
                    }
                }
            });
        });
    }

    playWithLevel(index: number) {
        this.hls.currentLevel = index;
        this.mediaElement.play();
        this.showLevelPicker(false);
    }

    destroy() {
        this.hls.destroy();
        super.destroy();
    }
}