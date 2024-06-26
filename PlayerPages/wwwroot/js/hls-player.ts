//import Hls from "../lib/hls.js/hls.js";
declare var Hls: any;

class HLSPlayer extends PPSPlayer {
    readonly hls: any;

    constructor(
        readonly mainElement: HTMLElement,
        readonly parentElement: HTMLElement,
        readonly src: string
    ) {
        super(mainElement, parentElement, src);

        this.levels([{
            name: `Automatic`,
            activate: () => {
                this.hls.selectedLevel = -1;
                this.hideLevelPicker();
            }
        }]);

        this.hls = new Hls();
        this.hls.attachMedia(this.mediaElement);
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            this.hls.loadSource(src);

            this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                let i = 0;
                for (const level of data.levels) {
                    const index = i;
                    this.levels.push({
                        name: `${Math.ceil(level.bitrate / 1024)} Kbps (${level.width}x${level.height})`,
                        activate: () => {
                            this.hls.currentLevel = index;
                            this.hideLevelPicker();
                        }
                    });
                    i++;
                }
            });

            this.hls.on(Hls.Events.LEVEL_UPDATED, (_, data) => {
                if (data.details.live) {
                    this.live(true);
                }
            });

            this.playing.subscribe(newValue => {
                console.log(0);
                if (newValue === true) {
                    console.log(1);
                    if (this.mediaElement.currentTime < this.hls.liveSyncPosition && this.live()) {
                        console.log(2);
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