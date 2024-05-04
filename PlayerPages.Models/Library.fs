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
    left: Image list
    right: Image list
}

module PageProperties =
    let Empty = {
        title = "Empty Page"
        top = []
        media = []
        links = []
        left = []
        right = []
    }

    let Example1 = {
        title = "My Page"
        media = [
            {
                title = "duckcam"
                src = "https://58e7f1650ff36.streamlock.net/duckcam/smil:duckcam.smil/playlist.m3u8"
            }
            {
                title = "Audio"
                src = "02 Green Greens [星のカービィ].mp3"
            }
            {
                title = "Live"
                src = "https://5e73cf528f404.streamlock.net/TeleEstense/livestream/playlist.m3u8"
            }
        ]
        top = [
            {
                src = "square.png"
                alt = "an avatar"
                bgcolor = "pink"
                href = Some "https://www.weau.com"
            }
        ]
        links = [
            {
                title = "WQOW"
                href = "https://www.wqow.com"
            }
            {
                title = "WXOW"
                href = "https://www.wxow.com"
            }
        ]
        left = [
            {
                src = "415b.png"
                alt = "tyler sitting on a pole"
                bgcolor = "cyan"
                href = Some "https://www.weau.com"
            }
        ]
        right = [
            {
                src = "415.png"
                alt = "tyler standing 1"
                bgcolor = "lightgray"
                href = Some "https://www.xkcd.com"
            }
            {
                src = "mynsxcf.png"
                alt = "a cartoon snail"
                bgcolor = "#ffffff"
                href = None
            }
        ]
    }
