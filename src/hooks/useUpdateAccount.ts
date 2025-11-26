import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export interface UpdateAccountRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountRequest) => authAPI.updateAccount(data),
    onSuccess: (response) => {
      // Update the user in the cache
      queryClient.setQueryData(["user"], response.data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
