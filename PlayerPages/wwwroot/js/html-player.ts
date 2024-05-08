class HTMLPlayer extends PPSPlayer {
    constructor(
        mainElement: HTMLElement,
        parentElement: HTMLElement,
        src: string
    ) {
        super(mainElement, parentElement, src);
        this.mediaElement.src = src;
    }
}