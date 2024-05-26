# PlayerPages

**PlayerPages** is a web application that generates and hosts minimalist, largely self-contained pages, which contain a mnenu, a media player with several options, and some optional branding.

The goal of PlayerPages is making a media player accessible to as many users, devices, and use cases as possible.
It assumes that the media itself is (1) hosted on a CDN, (2) available for free, and (3) H.264/AAC in either an MPEG-4 or HLS container.

## Pages

PlayerPages is based on the concept of decicated pages, each of which may represent a certain media presentation or event.
It has an API (`ManagementController`) that allows another application to:

* add, update, or delete a page
* turn public visibility for the page on or off
* get a copy of the page (even if it's not visible to the public) that can be proxyed to an end user (for preview purposes, or as an alternate player mode for old devices)

Each page is given a generated ID (used in its URL), and can have:

* a title (required)
* a list of banner images (typically you would use zero or one)
* a list of .mp4 or HLS media (each with a title and a URL); the first one in the list will be loaded by default if JavaScript is active
* a list of external links (to appear below the media in the main menu)
* a list of vertically-stacked images along the right edge

Images can have links (to external sites), alt text, and background colors.

Pages can be accessed through `RenderController`:

* `GET /public/{id}` (for pages with public visibility turned on; no authentication required)
* `GET /private/{id}` (for any page, including non-public pages; requires admin access)
* `POST /render` (renders the page described by the POST body; requires admin access)

Pages are stored in EF Core. For testing purposes, PlayerPages is set to use an in-memory data store, so **you must replace this** with something like SQL or Cosmos to persist the pages themselves.

The management API and the private render endpoints are secured by `PlayerPagesAdminAuthorizationAttribute`, which **you must implement yourself**.
The default implementation of this attribute does not allow admin access to anyone.

## CSS

The base CSS in PlayerPages renders the page as a simple document. This is called "Page View", and consists of the following elements, horizontally centered in a column:

* Any header image(s)
* The collapsible menu, containing the list of media and links
* A large Play button (if the media is loaded via JavaScript and not already playing)
* A video player
* Play/Pause and Mute/Unmute buttons
* A volume bar
* Buttons for:
    * Volume up and down
    * Select quality level (for adaptive streams playe via hls.js)
    * Cast / AirPlay (if applicable)
    * Full screen
* A seek bar (if the media is not live)
* Buttons to jump back/forward 10/30 seconds (if applicable)
* Any "right-edge" images, in square boxes, arranged in one or more rows

<a href="https://www.lakora.us/PlayerPages/PageView.png">
    <img src="https://www.lakora.us/PlayerPages/PageView.png"
         alt="A screenshot of the page in Page View"
         width="300" />
</a>

In modern browsers, an additional stylesheet is applied that turns the page into a single-page application.
The header is drawn on the top edge, across the entire width of the browser; the menu is placed below it;
the images are placed along the right edge (sharing space equally between them); and the media player takes
the rest of the space. The media player controls are shown beneath (not overlaid on) the player, and are
hidden when the media is playing and the mouse cursor is idle. Buttons turn blue when hovered over (unless
Windows high contrast mode is active, in which case the Windows highlight color is used).

Some media player controls (the volume up and down buttons, and the jump back/forward buttons) are hidden
in this mode, but can be accessed by screen readers or revealed with the Tab key.

<a href="https://www.lakora.us/PlayerPages/ApplicationView.png">
    <img src="https://www.lakora.us/PlayerPages/ApplicationView.png"
         alt="A screenshot of the page in Application View"
         width="300" />
</a>

In Firefox, you can switch between these two views using View > Page Style.

## JavaScript

In modern browsers, PlayerPages will load media into the player whenever the user clicks one of the media
links in the menu, and automatically load the first media in the list upon page load.

PlayerPages contains three player implementations. One uses [hls.js](https://github.com/video-dev/hls.js/),
and is loaded if the media has an HLS `Content-Type` and hls.js is supported in the browser. Another uses
the native HTML video player and is loaded in most other cases. If Google Cast is active, a third player
is loaded that controls the remote device using [Cast.js](https://github.com/castjs/castjs).

The media will not play automatically. This allows the user to select a lower quality level (when playing
an adaptive HLS stream) before clicking Play, which can help on old desktops. (This has been tested on a
PowerMac G4 running TenFourFox, which can work with hls.js.)

If the JavaScript fails to run, the media player on the page will not be loaded, and the media links in the
menu will simply be normal links that open the media URL in a new tab. Most browsers can play .mp4 video
directly, and most mobile browsers can play HLS directly as well. (For example, an iPod touch running iOS 6
can visit the page and view the video in this way, despite the scripts not running properly in the included
version of Safari.)

An additional "Alternate Links" menu is also placed on the page. This menu is intended for older mobile or
TV-connected devices (e.g. Wii U and other game consoles), and each item is a direct link to the media itself
over plain HTTP (not HTTPS). Like some of the media controls, this menu is normally hidden in Application
View, but can be revealed with the Tab key.

A special case is made for Internet Explorer, which also renders each media URL inside an instance of the
VLC ActiveX plugin (which is installed by default when the VLC media player is installed). In this case, the
HTTP (not HTTPS) media URL is used.

## CDN

PlayerPages is designed to be exposed to the public only through a CDN. (Part of making the media as accessible
as possible is simply ensuring that it can be accessed by a large number of people.)

The interface `IContentDeliveryNetwork` is used to accomplish this. **You should update the implementation of
this interface** to connect to your own CDN. It contains two methods:

* `GetPagePath`
  * Given a page ID, returns the absolute URL where people can access this page (or could access it, if it were public).
    By setting this appropriately, you can ensure that even if the page is proxied through another server (through
    `GET /private/{id}` or `POST /render`), the assets (CSS and JavaScript) are still fetched from the CDN due to the
    `base` tag on the page. The default implementation returns null, which means the `base` tag is not used.
* `InvalidateCacheAsync`
  * Given a page ID, tells the CDN to clear its cached copy of a particular page. This will most likely need the
    same absolute URL returned by `GetPagePath`. The default implementation is a no-op.
