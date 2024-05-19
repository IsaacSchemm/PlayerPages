namespace PlayerPages
{
    public static class AuthorizationExtensions
    {
        public static bool IsAdmin(this HttpRequest request)
        {
            return request.Headers.UserAgent.Any(str => str?.Contains("SeaMonkey") == true);
        }
    }
}