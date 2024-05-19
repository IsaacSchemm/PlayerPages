using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlayerPages
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class PlayerPagesAdminAuthorizationAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!context.HttpContext.Request.Headers.UserAgent.Any(str => str?.Contains("SeaMonkey") == true))
            {
                context.Result = new StatusCodeResult(403);
            }
        }
    }
}