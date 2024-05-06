const player = ko.observable<PPSPlayer>();

ko.applyBindings({ player }, document.getElementsByTagName("main")[0]);

async function delay(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
}

const getContentTypeAsync = async (src: string) => {
    try {
        const resp = await fetch(src, {
            method: "HEAD",
            cache: "no-store"
        });
        if (resp && resp.ok) {
            return resp.headers.get("Content-Type");
        }
    } catch (e) {
        console.warn(e);
    }

    return null;
}

const loadMedia = (src: string, contentType: string) => {
    try {
        // Clean up previous player (if any)
        const oldPlayer = player();
        if (oldPlayer) {
            player(null);
            oldPlayer.destroy();
        }

        const videoParent = document.getElementById("video-parent");
        videoParent.innerHTML = "";

        const playButton = document.createElement("button");
        playButton.id = "play-button";
        playButton.innerHTML = `<span class="material-icons" aria-hidden="true">play_arrow</span>`;
        videoParent.appendChild(playButton);

        videoParent.appendChild(document.createElement("div"));

        const video = document.createElement("video");
        videoParent.appendChild(video);

        // Determine which JavaScript player to use
        let isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
            || contentType.toLowerCase() == "application/x-mpegurl";

        // If hls.js is not loaded or will not work, just use an HTML player
        if (!("Hls" in window) || !Hls.isSupported())
            isHLS = false;

        // Initialize the player
        const pl = isHLS
            ? new HLSPlayer(
                document.getElementsByTagName("main")[0],
                video,
                src)
            : new HTMLPlayer(
                document.getElementsByTagName("main")[0],
                video,
                src);

        pl.playing.subscribe(newValue => {
            playButton.style.visibility = newValue ? "hidden" : "";
        });
        playButton.addEventListener("click", e => {
            e.preventDefault();
            video.play();
        });

        // Bind the player controls
        player(pl);
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

        if (!contentType) {
            // On Wii U, most requests to HTTPS servers will fail due to its
            // old certificate store, but it will allow requests to an HTTP
            // server from an HTTPS page. If that succeeds, we know the stream
            // is accessible over HTTP, so we should update the link.

            const http = mediaLink.href
                .replace(/^https:\/\/([^\/:]+\.streamlock\.net)\//, "http://$1:1935/")
                .replace(/^https:\/\/([^\/:]+)\//, "http://$1/");
            if (http != mediaLink.href) {
                contentType = await getContentTypeAsync(http);
                if (contentType) {
                    mediaLink.href = http;
                    mediaLink.innerText += " (HTTP)";
                }
            }
        }

        // If we couldn't access this media and determine its type, then just
        // leave the link as-is
        if (!contentType)
            return;

        mediaLink.addEventListener("click", e => {
            e.preventDefault();

            // Close the menu
            document.getElementById("menu").removeAttribute("open");

            // Load the media
            loadMedia(mediaLink.href, contentType);
        });

        // The first media in the list should be loaded automatically
        if (autoload) {
            loadMedia(mediaLink.href, contentType);
        }
    } catch (e) {
        console.warn("Could not configure media link handler", e);
    }
}

try {
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
} catch (e) {
    console.warn("Could not configure media link handlers", e);
}
