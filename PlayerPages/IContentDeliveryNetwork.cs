namespace PlayerPages
{
    public interface IContentDeliveryNetwork
    {
        string? GetPagePath(string playerPagesPageId);
        Task InvalidateCacheAsync(string playerPagesPageId);
    }
}
