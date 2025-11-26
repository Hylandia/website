import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export function useSendPasswordResetCode() {
  return useMutation({
    mutationFn: (email: string) => authAPI.sendPasswordResetCode(email),
  });
}
