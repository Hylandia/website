import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export function useIsAuthenticated() {
  const { data: user, isLoading } = useUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

export function useRequireAuth() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (!isLoading && !isAuthenticated) {
    const currentUrl = window.location.href;
    navigate(`/auth?redirect_url=${encodeURIComponent(currentUrl)}`);
  }

  return { isAuthenticated, isLoading, user };
}
