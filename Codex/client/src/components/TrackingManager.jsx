import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { trackPageView } from "../utils/tracking";

export default function TrackingManager() {
  const location = useLocation();
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent) return;
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search, consent]);

  return null;
}
