import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/auth-api";

export function useVerifyEmail() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; code: string }) =>
      authAPI.verifyEmail(data),
    onSuccess: () => {
      // Redirect to login with success message
      navigate("/auth?verified=true");
    },
  });
}
