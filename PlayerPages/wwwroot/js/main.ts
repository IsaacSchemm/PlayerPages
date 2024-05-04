/// <reference path="hls-player.ts" />

declare var wiiu: any;

const player = ko.observable<PPSPlayer>();

ko.applyBindings({
    controllablePlayer: ko.pureComputed(() => {
        const pl = player();
        return pl && !pl.nativeControls() ? pl : null;
    })
}, document.getElementsByTagName("main")[0]);

const getContentTypeAsync = async (src: string) => {
    try {
        const resp = await fetch(src, {
            method: "HEAD"
        });
        if (resp.ok) {
            return resp.headers.get("Content-Type");
        }
    } catch (e) {
        console.warn(e);
    }

    return null;
}

const loadMedia = (src: string, contentType: string) => {
    console.log(src, contentType);
    try {
        const oldPlayer = player();
        if (oldPlayer) {
            player(null);
            oldPlayer.destroy();
        }

        const video = document.createElement("video");
        video.src = src;

        const videoParent = document.getElementById("video-parent");
        videoParent.innerHTML = "";
        videoParent.appendChild(video);

        const isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
            || contentType.toLowerCase() == "application/x-mpegurl";

        const pl = isHLS
            ? new HLSPlayer(
                document.getElementsByTagName("main")[0],
                video,
                src)
            : new PPSPlayer(
                document.getElementsByTagName("main")[0],
                video);

        player(pl);
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    try {
        const mediaLinks = document.querySelectorAll("a.media");
        let first = true;

        for (let i = 0; i < mediaLinks.length; i++) {
            const mediaLink = mediaLinks[i];
            if (!(mediaLink instanceof HTMLAnchorElement))
                continue;

            console.log(mediaLink.href);

            const contentType = await getContentTypeAsync(mediaLink.href);

            if (contentType) {
                mediaLink.addEventListener("click", e => {
                    if (!mediaLink.href)
                        return;

                    e.preventDefault();
                    loadMedia(mediaLink.href, contentType);
                });

                if (first) {
                    console.log(`Automatically loading: ${mediaLink.href}`);
                    loadMedia(mediaLink.href, contentType);
                    first = false;
                }
            }
        }
    } catch (e) {
        console.warn("Could not automatically load media", e);
    }
})();
