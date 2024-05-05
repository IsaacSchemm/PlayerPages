//import Hls from "../lib/hls.js/hls.js";
declare var Hls: any;

class HLSPlayer extends PPSPlayer {
    readonly hls: any;

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

            this.hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
            });
            this.hls.on(Hls.Events.LEVEL_LOADED, data => {
                if (data.details.live) {
                    this.live(true);
                }
            });
            this.hls.on(Hls.Events.LEVEL_UPDATED, (_, data) => {
                console.log(data.details);
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

    destroy() {
        this.hls.destroy();
        super.destroy();
    }
}