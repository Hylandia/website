import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI, type RegisterRequest } from "@/lib/auth-api";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (_, variables) => {
      // Redirect to email verification with user's email
      navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });
}
