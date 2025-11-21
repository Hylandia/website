import { Responses, withNextAPI } from "@/lib/api-utils";
import { assertScope, filterByScope, OAUTH_SCOPES } from "@/lib/oauth-scopes";

export const GET = (request: Request) =>
  withNextAPI(
    {
      request,
    },
    async (req, auth) => {
      if (!auth) {
        return Responses.Success(null);
      }

      assertScope(auth, OAUTH_SCOPES.USER_READ);

      const filteredAuth = filterByScope(auth, auth, {
        email: OAUTH_SCOPES.USER_READ_EMAIL,
        username: OAUTH_SCOPES.USER_READ,
        role: OAUTH_SCOPES.USER_READ_RBAC,
        permissions: OAUTH_SCOPES.USER_READ_RBAC,
      });

      return Responses.Success({
        ...filteredAuth,

        userId: auth.userId,
        clerkId: auth.clerkId,
        type: auth.type,
        scope: auth.scope,
      });
    }
  );
