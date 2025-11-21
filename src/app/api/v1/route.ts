import { Responses, withNextAPI } from "@/lib/api-utils";

export const GET = (request: Request) =>
  withNextAPI(
    {
      request,
      ensureAuth: false,
    },
    async (req, auth) => {
      console.log({ auth });
      return {
        message: "API v1",
        version: "1.0.0",
        authenticated: !!auth,
      };
    }
  );
