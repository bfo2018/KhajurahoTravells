import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getConsentCookieName, readCookie, writeCookie } from "../utils/cookies";
import { syncTrackingScripts } from "../utils/tracking";

const CookieConsentContext = createContext(null);

const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false
};

export function CookieConsentProvider({ children }) {
  const [consent, setConsent] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const savedConsent = readCookie(getConsentCookieName());

    if (savedConsent) {
      setConsent(savedConsent);
      syncTrackingScripts(savedConsent);
      return;
    }

    setBannerVisible(true);
  }, []);

  const persistConsent = (nextConsent) => {
    const sanitizedConsent = {
      necessary: true,
      analytics: Boolean(nextConsent.analytics),
      marketing: Boolean(nextConsent.marketing)
    };

    setConsent(sanitizedConsent);
    setBannerVisible(false);
    setSettingsOpen(false);
    writeCookie(getConsentCookieName(), sanitizedConsent);
    syncTrackingScripts(sanitizedConsent);
  };

  const value = useMemo(
    () => ({
      consent,
      bannerVisible,
      settingsOpen,
      defaultConsent,
      acceptAll: () => persistConsent({ necessary: true, analytics: true, marketing: true }),
      rejectAll: () => persistConsent(defaultConsent),
      savePreferences: persistConsent,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false)
    }),
    [consent, bannerVisible, settingsOpen]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
