import { Responses, withNextAPI } from "@/lib/api-utils";

export const GET = (request: Request) =>
  withNextAPI(
    {
      request,
    },
    async (req, auth) => {
      return Responses.Success(auth);
    }
  );
