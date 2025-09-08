/// <reference path="knockout.d.ts" />

declare var Castjs: any;

namespace PPS {
    export const cjs = typeof Castjs === "function"
        ? new Castjs()
        : null;

    if (cjs) {
        cjs.on("connect", () => casting(true));
        cjs.on("disconnect", () => casting(false));
    }

    export const casting = ko.observable(cjs?.connected);

    const player = ko.observable<PPSPlayer | CastjsPlayer>();

    casting.subscribe(() => {
        const pl = player();
        if (!pl)
            return;

        loadMedia(
            pl.src,
            pl instanceof HLSPlayer ? "hls" : "unknown");
    });

    ko.applyBindings({
        player,
        idle: ko.pureComputed(() => {
            const pl = player();
            return pl && pl.mouseIdle() && pl.playing();
        }),
        paused: ko.pureComputed(() => {
            const pl = player();
            return pl ? !pl.playing() : false;
        }),
        play: () => {
            const pl = player();
            if (pl) {
                pl.play();
            }
        }
    }, document.getElementsByTagName("main")[0]);

    const getContentTypeAsync = async (src: string) => {
        // Make a HEAD request to get the content type.
        // This may fail if the remote server does not have CORS set up, or - on
        // newer browsers - if the protocol(HTTP vs.HTTPS) does not match.

        try {
            const resp = await fetch(src, { method: "HEAD" });
            if (resp && resp.ok)
                return resp.headers.get("Content-Type");
        } catch (e) {
            console.log(`Could not determine content type of remote media at ${src}`, e);
        }

        return null;
    }

    const loadMedia = (src: string, format: "hls" | "unknown") => {
        // Called when the user selects a media link from the menu (if handlers
        // are set up); may be called on page load for the first media link.

        try {
            // Clean up previous player (if any)
            const oldPlayer = player();

            // Store old player's source and seek time
            const oldSrc = oldPlayer?.src;
            const oldTime = oldPlayer?.currentTimeMs();

            if (oldPlayer) {
                player(null);
                oldPlayer.destroy();
            }

            // Initialize the player
            const pl =
                casting()
                    ? new CastjsPlayer(
                        document.getElementsByTagName("main")[0],
                        document.getElementById("video-parent")!,
                        src)
                : format === "hls" && "Hls" in window && Hls.isSupported()
                    ? new HLSPlayer(
                        document.getElementsByTagName("main")[0],
                        document.getElementById("video-parent")!,
                        src)
                    : new PPSPlayer(
                        document.getElementsByTagName("main")[0],
                        document.getElementById("video-parent")!,
                        src);

            // Bind the player controls
            player(pl);

            // If it's the same media as before, try to seek to the same point
            // (for better Google Cast experience)
            if (pl.src === oldSrc) {
                (async () => {
                    try {
                        // Request autoplay in this situation
                        pl.play();

                        // Wait for media to start playing
                        while (!pl.playing()) {
                            await new Promise<void>(r => pl.playing.subscribe(() => r()));
                        }

                        // Seek to the same timestamp that the player was at previously
                        pl.currentTimeMs(oldTime);
                    } catch (e) {
                        console.warn(e);
                    }
                })();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function attachHandlerAsync(mediaLink: HTMLAnchorElement, autoload: boolean) {
        try {
            // Check the content type, to determine which player to use and to
            // confirm that the media exists. If this fails because of a CORS
            // issue, chances are the media won't work anyway (e.g. HLS) or maybe
            // opening in a new tab is perfectly fine (e.g. mp4).

            let contentType = await getContentTypeAsync(mediaLink.href);

            // Determine which JavaScript player to use
            const isHLS = contentType?.toLowerCase() === "application/vnd.apple.mpegurl"
                || contentType?.toLowerCase() == "application/x-mpegurl";
            const format = isHLS ? "hls" : "unknown";

            mediaLink.addEventListener("click", e => {
                // If we couldn't access this media and determine its type,
                // just take the default link action of opening in a new tab,
                // unless Google Cast is already active
                if (!contentType && !casting())
                    return;

                e.preventDefault();

                // Close the menu
                document.getElementById("menu").removeAttribute("open");

                // Load the media
                loadMedia(mediaLink.href, format);
            });

            // The first media in the list should be loaded automatically
            if (contentType && autoload) {
                loadMedia(mediaLink.href, format);
            }
        } catch (e) {
            console.warn("Could not configure media link handler", e);
        }
    }

    // These media links were placed on the page, and currently are just
    // normal links to the media URLs.

    // Loop through these links, see if we can fetch their URLs, and then
    // attach click handlers so the links open the video on the page
    // itself, instead.

    const mediaLinks = document.querySelectorAll("a.media");

    for (let i = 0; i < mediaLinks.length; i++) {
        const mediaLink = mediaLinks[i];
        if (!(mediaLink instanceof HTMLAnchorElement))
            continue;

        attachHandlerAsync(mediaLink, i == 0);
    }
}
