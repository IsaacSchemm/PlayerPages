const player = ko.observable<PPSPlayer>();

ko.applyBindings({ player }, document.getElementsByTagName("main")[0]);

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
    try {
        // Clean up previous player (if any)
        const oldPlayer = player();
        if (oldPlayer) {
            player(null);
            oldPlayer.destroy();
        }

        // Create new HTML video player element and place it onto the page
        const video = document.createElement("video");

        const videoParent = document.getElementById("video-parent");
        videoParent.innerHTML = "";
        videoParent.appendChild(video);

        // Determine which JavaScript player to use
        let isHLS = contentType.toLowerCase() === "application/vnd.apple.mpegurl"
            || contentType.toLowerCase() == "application/x-mpegurl";

        // If hls.js is not loaded or will not work, just use an HTML player
        // (may allow at least some versions of iOS to work)

        if ("Hls" in window && !Hls.isSupported())
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

        // Bind the player controls
        player(pl);
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    try {
        // These media links were placed on the page, and currently are just
        // normal links to the media URLs.

        // Loop through these links, see if we can fetch their URLs, and then
        // attach click handlers so the links open the video on the page
        // itself, instead.

        // The first link that can be fetched will also be loaded into the
        // player automatically.

        const mediaLinks = document.querySelectorAll("a.media");
        let first = true;

        for (let i = 0; i < mediaLinks.length; i++) {
            const mediaLink = mediaLinks[i];
            if (!(mediaLink instanceof HTMLAnchorElement))
                continue;

            const src = mediaLink.getAttribute("data-src");

            // Try to fetch the media
            const contentType = await getContentTypeAsync(src);

            if (contentType) {
                // We were able to confirm that this URL exists, and we know
                // its content type

                mediaLink.addEventListener("click", e => {
                    e.preventDefault();

                    // Close the menu
                    document.getElementById("menu").removeAttribute("open");

                    // Load the media
                    loadMedia(src, contentType);
                });

                if (first) {
                    // Load the media now
                    console.log(`Automatically loading: ${mediaLink.href}`);
                    loadMedia(src, contentType);

                    // Do not automatically load any other media
                    first = false;
                }
            }
        }
    } catch (e) {
        console.warn("Could not configure media link handlers", e);
    }
})();
