const trackingState = {
  analyticsLoaded: false,
  marketingLoaded: false,
  consent: {
    necessary: true,
    analytics: false,
    marketing: false
  }
};

function getGaId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID;
}

function getPixelId() {
  return import.meta.env.VITE_FB_PIXEL_ID;
}

function appendScript(id, src) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadGoogleAnalytics() {
  const measurementId = getGaId();
  if (!measurementId || trackingState.analyticsLoaded) return;

  appendScript("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
  trackingState.analyticsLoaded = true;
}

function loadFacebookPixel() {
  const pixelId = getPixelId();
  if (!pixelId || trackingState.marketingLoaded) return;

  if (!window.fbq) {
    window.fbq = function fbq() {
      if (window.fbq.callMethod) {
        window.fbq.callMethod.apply(window.fbq, arguments);
      } else {
        window.fbq.queue.push(arguments);
      }
    };
    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
  }

  appendScript("fb-pixel-script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", pixelId);
  trackingState.marketingLoaded = true;
}

export function syncTrackingScripts(consent) {
  trackingState.consent = consent;

  if (consent.analytics) {
    loadGoogleAnalytics();
  }

  if (consent.marketing) {
    loadFacebookPixel();
  }
}

export function trackPageView(pathname) {
  if (trackingState.consent.analytics && window.gtag && getGaId()) {
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_title: document.title
    });
  }

  if (trackingState.consent.marketing && window.fbq && getPixelId()) {
    window.fbq("track", "PageView");
  }
}

export function trackPackageClick(travelPackage) {
  if (trackingState.consent.analytics && window.gtag) {
    window.gtag("event", "package_click", {
      package_name: travelPackage.name,
      value: travelPackage.price
    });
  }

  if (trackingState.consent.marketing && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: travelPackage.name,
      content_category: "package",
      value: travelPackage.price,
      currency: "INR"
    });
  }
}

export function trackViewContent(contentType, data) {
  if (trackingState.consent.analytics && window.gtag) {
    window.gtag("event", "view_item", {
      item_name: data.name,
      item_category: contentType
    });
  }

  if (trackingState.consent.marketing && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: data.name,
      content_category: contentType,
      value: data.value || 0,
      currency: "INR"
    });
  }
}

export function trackBookingStarted(payload) {
  if (trackingState.consent.analytics && window.gtag) {
    window.gtag("event", "begin_checkout", payload);
  }

  if (trackingState.consent.marketing && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_name: payload.item_name,
      value: payload.value || 0,
      currency: "INR"
    });
  }
}

export function trackPurchase(payload) {
  if (trackingState.consent.analytics && window.gtag) {
    window.gtag("event", "purchase", payload);
  }

  if (trackingState.consent.marketing && window.fbq) {
    window.fbq("track", "Purchase", {
      value: payload.value || 0,
      currency: "INR",
      content_name: payload.transaction_id
    });
  }
}
