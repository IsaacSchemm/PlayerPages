using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlayerPages
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class PlayerPagesAdminAuthorizationAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            context.Result = new StatusCodeResult(403);
        }
    }
}