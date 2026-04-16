import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Home from "./pages/Home";
import History from "./pages/History";
import TransactionDetail from "./pages/TransactionDetail";
import PayPhone from "./pages/PayPhone";
import PayQR from "./pages/PayQR";
import PayServices from "./pages/PayServices";
import PayCompanies from "./pages/PayCompanies";
import PayUniversities from "./pages/PayUniversities";
import PayBanks from "./pages/PayBanks";
import PayInternational from "./pages/PayInternational";
import PayInterbank from "./pages/PayInterbank";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Recovery from "./pages/Recovery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<TransactionDetail />} />
          <Route path="/pay/phone" element={<PayPhone />} />
          <Route path="/pay/qr" element={<PayQR />} />
          <Route path="/pay/services" element={<PayServices />} />
          <Route path="/pay/companies" element={<PayCompanies />} />
          <Route path="/pay/universities" element={<PayUniversities />} />
          <Route path="/pay/banks" element={<PayBanks />} />
          <Route path="/pay/international" element={<PayInternational />} />
          <Route path="/pay/interbank" element={<PayInterbank />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
