import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export function useSendVerificationCode() {
  return useMutation({
    mutationFn: (email: string) => authAPI.sendVerificationCode(email),
  });
}
