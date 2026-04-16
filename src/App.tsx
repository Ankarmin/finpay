import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import Home from "./pages/Home";
import History from "./pages/History";
import TransactionDetail from "./pages/TransactionDetail";
import PayPhone from "./pages/PayPhone";
import PayQR from "./pages/PayQR";
import PayServices from "./pages/PayServices";
import PayUniversities from "./pages/PayUniversities";
import PayBanks from "./pages/PayBanks";
import PayInternational from "./pages/PayInternational";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Recovery from "./pages/Recovery";
import NotFound from "./pages/NotFound";

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<TransactionDetail />} />
        <Route path="/pay/phone" element={<PayPhone />} />
        <Route path="/pay/qr" element={<PayQR />} />
        <Route path="/pay/services" element={<PayServices />} />
        <Route path="/pay/universities" element={<PayUniversities />} />
        <Route path="/pay/banks" element={<PayBanks />} />
        <Route path="/pay/international" element={<PayInternational />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
