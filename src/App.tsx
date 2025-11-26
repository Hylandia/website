import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import LogoutPage from "./pages/Logout";
import VerifyEmailPage from "./pages/VerifyEmail";
import ForgotPasswordPage from "./pages/ForgotPassword";
import LeaderboardsPage from "./pages/Leaderboards";
import SettingsLayout from "./pages/settings/Layout";
import AccountSettingsPage from "./pages/settings/Account";
import ConnectionsSettingsPage from "./pages/settings/Connections";
import SecuritySettingsPage from "./pages/settings/Security";
import PreferencesSettingsPage from "./pages/settings/Preferences";
import GameStatsSettingsPage from "./pages/settings/GameStats";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import RefundPage from "./pages/Refund";
import NotFoundPage from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen overflow-x-hidden antialiased bg-neutral">
          <Navigation />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/leaderboards" element={<LeaderboardsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route path="account" element={<AccountSettingsPage />} />
                <Route
                  path="connections"
                  element={<ConnectionsSettingsPage />}
                />
                <Route path="security" element={<SecuritySettingsPage />} />
                <Route
                  path="preferences"
                  element={<PreferencesSettingsPage />}
                />
                <Route path="game-stats" element={<GameStatsSettingsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
