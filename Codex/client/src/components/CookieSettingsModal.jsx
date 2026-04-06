import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";

function Toggle({ checked, disabled = false, onChange }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
        checked ? "bg-dune" : "bg-stone-300"
      } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieSettingsModal() {
  const {
    consent,
    settingsOpen,
    defaultConsent,
    closeSettings,
    savePreferences,
    acceptAll
  } = useCookieConsent();
  const [draft, setDraft] = useState(defaultConsent);

  useEffect(() => {
    setDraft(consent || defaultConsent);
  }, [consent, defaultConsent, settingsOpen]);

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#1f1a17]/55 backdrop-blur-sm"
            onClick={closeSettings}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="fixed left-1/2 top-1/2 z-[90] w-[min(760px,calc(100%-24px))] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/70 bg-white p-6 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[#f4e7d4] p-3 text-dune">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="eyebrow">Cookie Settings</p>
                  <h3 className="mt-2 font-display text-4xl text-ink">Manage your privacy preferences</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Choose which optional cookies you allow. Necessary cookies always stay enabled for login, session, and booking functions.
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeSettings} className="rounded-full border border-stone-200 p-3">
                <X size={16} />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">Necessary Cookies</h4>
                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      Login/session handling and booking functionality.
                    </p>
                  </div>
                  <Toggle checked disabled />
                </div>
              </div>

              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">Analytics Cookies</h4>
                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      Google Analytics for page views, package clicks, and booking funnel performance.
                    </p>
                  </div>
                  <Toggle
                    checked={draft.analytics}
                    onChange={(value) => setDraft((current) => ({ ...current, analytics: value }))}
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">Marketing Cookies</h4>
                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      Facebook Pixel and retargeting scripts for campaign measurement and ad personalization.
                    </p>
                  </div>
                  <Toggle
                    checked={draft.marketing}
                    onChange={(value) => setDraft((current) => ({ ...current, marketing: value }))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button type="button" className="secondary-button" onClick={() => savePreferences(draft)}>
                Save Preferences
              </button>
              <button type="button" className="primary-button" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
