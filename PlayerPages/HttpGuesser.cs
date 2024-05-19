using PlayerPages.Models;

namespace PlayerPages
{
    public static class HttpGuesser
    {
        public static string? GuessHttpUrl(this Media media)
        {
            if (!Uri.TryCreate(media.src, UriKind.Absolute, out var uri))
            {
                return null;
            }

            if (uri.Scheme != "https")
            {
                return null;
            }

            if (uri.Host.EndsWith(".streamlock.net"))
            {
                return $"http://{uri.Host}:1935{uri.PathAndQuery}{uri.Fragment}";
            }

            return $"http://{uri.Host}{uri.PathAndQuery}{uri.Fragment}";
        }
    }
}
