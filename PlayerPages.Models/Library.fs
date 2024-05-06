namespace PlayerPages.Models

open System

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
                title = "Duck Cam"
                src = "https://58e7f1650ff36.streamlock.net/duckcam/smil:duckcam.smil/playlist.m3u8"
            }
            {
                title = "Intentional 404"
                src = "https://www.example.com/2b61eb50-b8a1-4160-b2ef-8e07d29d52f0.mp4"
            }
            {
                title = "MSL HLS test stream"
                src = "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
            }
            {
                title = "Big_Buck_Bunny_360_10s_1MB.mp4"
                src = "Big_Buck_Bunny_360_10s_1MB.mp4"
            }
            {
                title = "Green Greens"
                src = "02 Green Greens [星のカービィ].mp3"
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
        right = [
            {
                src = "415b.png"
                alt = "tyler sitting on a pole"
                bgcolor = "cyan"
                href = Some "https://www.weau.com"
            }
            {
                src = "415.png"
                alt = "tyler standing 1"
                bgcolor = "lightgray"
                href = Some "https://www.xkcd.com"
            }
        ]
    }
