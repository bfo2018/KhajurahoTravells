import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import FloatingActions from "../components/FloatingActions";
import CookieBanner from "../components/CookieBanner";
import CookieSettingsModal from "../components/CookieSettingsModal";
import TrackingManager from "../components/TrackingManager";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen">
      <TrackingManager />
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingActions />
      <ChatWidget />
      <CookieBanner />
      <CookieSettingsModal />
    </div>
  );
}
