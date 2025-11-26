"use client";

import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendVerification(email),
  });
}
