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
    let Example1 = {
        title = "My Page"
        media = [
            {
                title = "720p"
                src = "https://ia800701.us.archive.org/26/items/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4"
            }
            {
                title = "Audio"
                src = "02 Green Greens [星のカービィ].mp3"
            }
            {
                title = "Live"
                src = "https://5e73cf528f404.streamlock.net/TeleEstense/livestream/playlist.m3u8"
            }
            {
                title = "a"
                src = "https://dai2-playlistserver.aws.syncbak.com/cpl/13729473/dai2v5/1/7b2264657669636554797065223a382c22616b616d61694d7670644b6579223a6e756c6c7d/master.m3u8?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMTYwNDAxIn0.eyJkZXZpY2VUeXBlIjo4LCJzaWQiOjMzMCwiY2lkIjoxMjEzMiwibWlkIjoxMzcyOTQ3MywibWsiOm51bGwsIm9vbSI6dHJ1ZSwiaXAiOiIxMzUuMTM0LjIyNS44MiIsInVpcCI6IjEzNS4xMzQuMjI1LjgyIiwiZG1hIjo3MDIsInNzaWQiOiJlMWEyNzdmMDBkOWI0NjI0YjFkMTgyYjRkMWY5ZGVhOSIsInNuIjoiV2ViIDc3NDIyZjQwYjAgKCBudWxsICkiLCJ1aWQiOm51bGwsImFwc3QiOm51bGwsInNiZXAiOmZhbHNlLCJjc2IiOmZhbHNlLCJtZDUiOiIzNGQzZWVmODcyZTY0ZmE1MTU2ZGI3NTI2ZDQxMmMyNyIsImlhdCI6MTcxNDAxMTEzMywiZXhwIjoxNzE0MDExNDMzLCJhdWQiOiJodHRwczovL3BsYXlsaXN0c2VydmVyLmF3cy5zeW5jYmFrLmNvbSIsImlzcyI6IlN5bmNiYWsgR3JhcGhRTCBBUEkiLCJzdWIiOiJCeTRmS1FyTFRlSFl4T2FnOFMzV0VINmEzbEZoS3pOTGE4c0ZWczF2MXEzVEVDQ2hnWSJ9.bY3It9hP4vj694iJ15iRv7f_JTOtmTu4dNsfv2hwQ5Y"
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
