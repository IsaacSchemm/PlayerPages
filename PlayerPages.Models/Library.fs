namespace PlayerPages.Models

type Media = {
    title: string
    src: string
}

type Link = {
    title: string
    href: string
}

type Image = {
    src: string
    alt: string
    bgcolor: string
    href: string option
}

type PageProperties = {
    title: string
    top: Image list
    media: Media list
    links: Link list
    right: Image list
}

module PageProperties =
    let Empty = {
        title = "Empty Page"
        top = []
        media = []
        links = []
        right = []
    }

    let Example1 = {
        title = "My Page"
        media = [
            {
                title = "ForBiggerFun.mp4"
                src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
            }
            {
                title = "Footbridge Live Stream"
                src = "https://58e7f1650ff36.streamlock.net/bridge/smil:bridge.smil/playlist.m3u8"
            }
            {
                title = "Sample call"
                src = "https://github.com/ringcentral/ringcentral-api-docs/raw/main/resources/sample-calls.mp3"
            }
        ]
        top = [
            {
                src = "../header.png"
                alt = "Sample Header Image"
                bgcolor = "darkred"
                href = None
            }
        ]
        links = [
            {
                title = "time.gov"
                href = "https://www.time.gov"
            }
        ]
        right = [
            {
                src = "../wide.png"
                alt = "A cyan and blue gradient with the word \"Wide\""
                bgcolor = "blue"
                href = None
            }
            {
                src = "../tall.png"
                alt = "A white and green gradient with the word \"Tall\""
                bgcolor = "darkgreen"
                href = Some "https://www.example.org"
            }
        ]
    }
