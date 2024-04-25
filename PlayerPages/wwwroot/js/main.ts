/// <reference path="hls-player.ts" />

const player = ko.observable<PPSPlayer>();

document.getElementById("debugLink").addEventListener("click", e => {
    e.preventDefault();

    if (document.body.parentElement.classList.contains("debug")) {
        document.body.parentElement.classList.remove("debug");
    } else {
        document.body.parentElement.classList.add("debug");
    }
});

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

    return "application/octet-stream";
}

const loadMediaAsync = async (src: string) => {
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

        const contentType =await getContentTypeAsync(src);
        const isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl";

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

const mediaLinks = document.querySelectorAll("a[target=mediaframe]");
for (let i = 0; i < mediaLinks.length; i++) {
    const mediaLink = mediaLinks[i];
    if (!(mediaLink instanceof HTMLAnchorElement)) continue;

    mediaLink.addEventListener("click", e => {
        if (!mediaLink.href) return;

        e.preventDefault();
        loadMediaAsync(mediaLink.href);
    });
}
if (mediaLinks.length > 0) {
    const firstLink = mediaLinks[0];
    if (firstLink instanceof HTMLAnchorElement) {
        loadMediaAsync(firstLink.href);
    }
}
