import { AnimatePresence, motion } from "framer-motion";
import { useCookieConsent } from "../context/CookieConsentContext";

export default function CookieBanner() {
  const { bannerVisible, acceptAll, rejectAll, openSettings } = useCookieConsent();

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-1/2 z-[70] w-[min(680px,calc(100%-24px))] -translate-x-1/2 rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-soft backdrop-blur sm:p-6"
        >
          <div className="grid gap-5">
            <div>
              <p className="eyebrow">Privacy Choices</p>
              <h3 className="mt-3 font-display text-[2rem] leading-tight text-ink sm:text-4xl">
                Your cookie preferences matter
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                We use cookies to improve your experience, analyze traffic, and personalize ads.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="primary-button w-full sm:flex-1" onClick={acceptAll}>
                Accept All
              </button>
              <button
                type="button"
                className="secondary-button w-full sm:flex-1"
                onClick={openSettings}
              >
                Customize
              </button>
              <button type="button" className="secondary-button w-full sm:flex-1" onClick={rejectAll}>
                Reject All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
