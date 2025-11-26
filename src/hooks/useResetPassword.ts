import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/auth-api";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; code: string; newPassword: string }) =>
      authAPI.resetPassword(data),
    onSuccess: () => {
      // Redirect to login with success message
      navigate("/auth?password-reset=true");
    },
  });
}
