class HTMLPlayer extends PPSPlayer {
    constructor(
        mainElement: HTMLElement,
        mediaElement: HTMLMediaElement,
        src: string
    ) {
        super(mainElement, mediaElement);
        mediaElement.src = src;
    }
}