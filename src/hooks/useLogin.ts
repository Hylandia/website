import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI, type LoginRequest } from "@/lib/auth-api";
import { authKeys } from "./useUser";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.data?.user);

      // Redirect to home or intended page
      const redirectUrl = new URLSearchParams(window.location.search).get(
        "redirect_url"
      );
      navigate(redirectUrl || "/");
    },
  });
}
