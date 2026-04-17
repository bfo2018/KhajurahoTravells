import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { InlineFieldLoader } from "../components/ContentLoader";
import Seo from "../components/Seo";
import { formatCurrency } from "../utils/formatters";
import { resolveMediaUrl } from "../utils/media";
import { getCarGallery } from "../utils/carGallery";
import { useAuth } from "../context/AuthContext";
import { loadGoogleMaps } from "../utils/googleMaps";
import { createBreadcrumbSchema, createLocalBusinessSchema } from "../utils/seo";
import { siteConfig } from "../utils/siteConfig";
import { trackBookingStarted } from "../utils/tracking";

const knownLocations = [
  "Khajuraho Airport",
  "Khajuraho Railway Station",
  "Western Temple Group",
  "Eastern Temple Group",
  "Southern Temple Group",
  "Chandela hotel",
  "Khajuraho",
  "Panna",
  "Panna National Park",
  "Raneh Falls",
  "Bageshwar Dham"
];

export default function BookingPage() {
  const { user, logout } = useAuth();
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [distanceMode, setDistanceMode] = useState("loading");
  const [mapsEnabled, setMapsEnabled] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPackageId = searchParams.get("package") || "";
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);
  const autocompleteCleanupRef = useRef([]);
  const bookingStartedRef = useRef(false);

  const [form, setForm] = useState({
    bookingType: initialPackageId ? "PACKAGE" : "CAR",
    carId: searchParams.get("car") || "",
    packageId: initialPackageId,
    pickupLocation: searchParams.get("pickupLocation") || "Khajuraho Airport",
    dropLocation: searchParams.get("dropLocation") || "Western Temple Group",
    travelDate: searchParams.get("travelDate") || "",
    travelTime: "10:00",
    distanceKm: "",
    tripType: initialPackageId ? "outstation" : "local",
    extraKm: "",
    notes: "",
    customer: {
      name: user?.name || "",
      email: user?.email || "",
      phone: ""
    }
  });

  useEffect(() => {
    const savedDraft = sessionStorage.getItem("booking_draft");

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft);
      setForm((current) => ({
        ...current,
        ...parsedDraft,
        customer: {
          ...current.customer,
          ...parsedDraft.customer
        }
      }));
    } catch {
      sessionStorage.removeItem("booking_draft");
    }
  }, []);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customer: {
        ...current.customer,
        name: user?.name || current.customer.name,
        email: user?.email || current.customer.email
      }
    }));
  }, [user]);

  useEffect(() => {
    let active = true;

    setCarsLoading(true);
    setPackagesLoading(true);

    api.get("/cars").then(({ data }) => {
      if (!active) return;

      setCars(data);
      if (!initialPackageId && !searchParams.get("car") && data[0]) {
        setForm((current) => ({ ...current, carId: data[0]._id }));
      }
    }).finally(() => {
      if (active) {
        setCarsLoading(false);
      }
    });

    api.get("/packages").then(({ data }) => {
      if (!active) return;

      setPackages(data);
      if (initialPackageId) return;
      if (data[0]) {
        setForm((current) => ({ ...current, packageId: current.packageId || data[0]._id }));
      }
    }).finally(() => {
      if (active) {
        setPackagesLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [initialPackageId, searchParams]);

  const selectedCar = useMemo(
    () => cars.find((car) => car._id === form.carId),
    [cars, form.carId]
  );

  const selectedPackage = useMemo(
    () => packages.find((travelPackage) => travelPackage._id === form.packageId),
    [packages, form.packageId]
  );

  const usingFallbackLocations = form.bookingType === "CAR" && !mapsEnabled;

  useEffect(() => {
    if (form.bookingType !== "CAR") {
      return undefined;
    }

    let mounted = true;

    loadGoogleMaps()
      .then((maps) => {
        if (!mounted || !maps || !maps.places || !pickupInputRef.current || !dropInputRef.current) {
          setMapsEnabled(false);
          return;
        }

        setMapsEnabled(true);

        const pickupAutocomplete = new maps.places.Autocomplete(pickupInputRef.current, {
          componentRestrictions: { country: "in" },
          fields: ["formatted_address", "name"]
        });

        const dropAutocomplete = new maps.places.Autocomplete(dropInputRef.current, {
          componentRestrictions: { country: "in" },
          fields: ["formatted_address", "name"]
        });

        const pickupListener = pickupAutocomplete.addListener("place_changed", () => {
          const place = pickupAutocomplete.getPlace();
          setForm((current) => ({
            ...current,
            pickupLocation: place.formatted_address || place.name || current.pickupLocation
          }));
        });

        const dropListener = dropAutocomplete.addListener("place_changed", () => {
          const place = dropAutocomplete.getPlace();
          setForm((current) => ({
            ...current,
            dropLocation: place.formatted_address || place.name || current.dropLocation
          }));
        });

        autocompleteCleanupRef.current = [pickupListener, dropListener];
      })
      .catch(() => {
        setMapsEnabled(false);
      });

    return () => {
      mounted = false;
      autocompleteCleanupRef.current.forEach((listener) => listener?.remove?.());
      autocompleteCleanupRef.current = [];
    };
  }, [form.bookingType]);

  useEffect(() => {
    if (form.bookingType === "PACKAGE" && selectedPackage) {
      setForm((current) => ({
        ...current,
        distanceKm: String(selectedPackage.includedKm),
        tripType: "outstation"
      }));
      setDistanceMode("auto");
      return;
    }

    if (form.bookingType !== "CAR" || !form.pickupLocation || !form.dropLocation) {
      return;
    }

    let cancelled = false;

    async function calculateDistance() {
      setDistanceMode("loading");

      try {
        const maps = await loadGoogleMaps();

        if (maps) {
          const service = new maps.DistanceMatrixService();
          const response = await service.getDistanceMatrix({
            origins: [form.pickupLocation],
            destinations: [form.dropLocation],
            travelMode: maps.TravelMode.DRIVING,
            unitSystem: maps.UnitSystem.METRIC
          });

          const element = response?.rows?.[0]?.elements?.[0];
          const meters = element?.distance?.value;

          if (!cancelled && meters) {
            setDistanceMode("auto");
            setForm((current) => ({
              ...current,
              distanceKm: String(Math.max(1, Math.round(meters / 1000)))
            }));
            return;
          }
        }

        const { data } = await api.get("/bookings/estimate-distance", {
          params: {
            pickup: form.pickupLocation,
            drop: form.dropLocation
          }
        });

        if (!cancelled) {
          setDistanceMode(data.estimatedDistanceKm ? "auto" : "manual");
          setForm((current) => ({
            ...current,
            distanceKm: data.estimatedDistanceKm ? String(data.estimatedDistanceKm) : ""
          }));
        }
      } catch {
        if (!cancelled) {
          setDistanceMode("manual");
          setForm((current) => ({ ...current, distanceKm: "" }));
        }
      }
    }

    calculateDistance();

    return () => {
      cancelled = true;
    };
  }, [form.pickupLocation, form.dropLocation, form.bookingType, selectedPackage]);

  const computedPrice = useMemo(() => {
    if (form.bookingType === "PACKAGE" && selectedPackage) {
      const extraKm = Math.max(Number(form.extraKm) || 0, 0);
      return {
        distanceKm: selectedPackage.includedKm + extraKm,
        total: selectedPackage.price + extraKm * selectedPackage.extraPerKm
      };
    }

    if (!selectedCar || !form.distanceKm) return null;
    const tripDistance = Number(form.distanceKm);
    return {
      distanceKm: tripDistance,
      total: tripDistance * selectedCar.pricePerKm
    };
  }, [form.bookingType, selectedCar, form.distanceKm, selectedPackage, form.extraKm]);

  useEffect(() => {
    if (bookingStartedRef.current || !computedPrice) return;

    const itemName =
      form.bookingType === "PACKAGE"
        ? selectedPackage?.name
        : selectedCar?.name;

    if (!itemName) return;

    bookingStartedRef.current = true;
    trackBookingStarted({
      item_name: itemName,
      booking_type: form.bookingType,
      value: computedPrice.total
    });
  }, [computedPrice, form.bookingType, selectedCar, selectedPackage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) {
      sessionStorage.setItem("booking_draft", JSON.stringify(form));
      navigate("/login", {
        state: {
          redirectTo: `${location.pathname}${location.search}`
        }
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/bookings", {
        ...form,
        distanceKm: Number(form.distanceKm),
        extraKm: Number(form.extraKm) || 0
      });
      sessionStorage.removeItem("booking_draft");
      navigate(`/booking/success/${data._id}`);
    } catch (apiError) {
      if (apiError.response?.status === 401) {
        sessionStorage.setItem("booking_draft", JSON.stringify(form));
        logout();
        navigate("/login", {
          state: {
            redirectTo: `${location.pathname}${location.search}`
          }
        });
        return;
      }

      setError(apiError.response?.data?.message || "Booking failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Book Taxi in Khajuraho | Instant Fare Estimator"
        description="Book taxi in Khajuraho with automatic distance calculation, package pricing, airport pickup, and secure booking confirmation."
        keywords={[
          "book taxi in Khajuraho",
          "Khajuraho cab booking",
          "Khajuraho airport pickup",
          "Khajuraho tour package booking"
        ]}
        path="/booking"
        schema={[
          createLocalBusinessSchema(),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Booking", path: "/booking" }
          ])
        ]}
      />
      <main className="section-shell py-12">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-panel p-8">
            <p className="eyebrow">Trip Estimator</p>
            <h1 className="mt-4 font-display text-5xl text-ink">Book your ride end-to-end</h1>
            <p className="mt-4 text-base leading-8 text-stone-600">
              Enter pickup and drop, and the website calculates route distance and fare automatically.
            </p>

            {form.bookingType === "CAR" && selectedCar && (
              <div className="mt-8 rounded-[28px] bg-stone-100 p-6">
                <img
                  src={resolveMediaUrl(getCarGallery(selectedCar)[0])}
                  alt={selectedCar.name}
                  loading="eager"
                  decoding="async"
                  className="h-56 w-full rounded-[22px] object-cover"
                />
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl text-ink">{selectedCar.name}</h2>
                    <p className="mt-2 text-sm text-stone-600">{selectedCar.summary}</p>
                  </div>
                  <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-dune">
                    {formatCurrency(selectedCar.pricePerKm)}/km
                  </p>
                </div>
              </div>
            )}

            {form.bookingType === "PACKAGE" && selectedPackage && (
              <div className="mt-8 rounded-[28px] bg-stone-100 p-6">
                <p className="eyebrow">Selected Package</p>
                <h2 className="mt-3 font-display text-3xl text-ink">{selectedPackage.name}</h2>
                <p className="mt-2 text-sm text-stone-600">{selectedPackage.description}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                    Base: {formatCurrency(selectedPackage.price)}
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                    Included: {selectedPackage.includedKm} km
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                    Extra: {formatCurrency(selectedPackage.extraPerKm)}/km
                  </div>
                </div>
              </div>
            )}

            {computedPrice && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-[#f4e7d4] p-5">
                  <p className="text-sm text-bronze">Estimated Distance</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{computedPrice.distanceKm} km</p>
                </div>
                <div className="rounded-3xl bg-ink p-5 text-white">
                  <p className="text-sm text-stone-300">Estimated Cost</p>
                  <p className="mt-2 text-3xl font-bold">{formatCurrency(computedPrice.total)}</p>
                </div>
              </div>
            )}
          </section>

          <form className="glass-panel grid gap-4 p-8 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-stone-700">
              Booking Type
              <select
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.bookingType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    bookingType: event.target.value,
                    carId: event.target.value === "CAR" ? current.carId || cars[0]?._id || "" : "",
                    packageId:
                      event.target.value === "PACKAGE"
                        ? current.packageId || packages[0]?._id || ""
                        : ""
                  }))
                }
              >
                <option value="CAR">Car</option>
                <option value="PACKAGE">Package</option>
              </select>
            </label>
            <label className="text-sm font-medium text-stone-700">
              Pickup
              <input
                ref={pickupInputRef}
                list={!mapsEnabled ? "known-locations" : undefined}
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.pickupLocation}
                onChange={(event) =>
                  setForm((current) => ({ ...current, pickupLocation: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700">
              Drop
              <input
                ref={dropInputRef}
                list={!mapsEnabled ? "known-locations" : undefined}
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.dropLocation}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dropLocation: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700">
              Travel Date
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.travelDate}
                required
                onChange={(event) =>
                  setForm((current) => ({ ...current, travelDate: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700">
              Travel Time
              <input
                type="time"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.travelTime}
                required
                onChange={(event) =>
                  setForm((current) => ({ ...current, travelTime: event.target.value }))
                }
              />
            </label>

            {form.bookingType === "CAR" ? (
              <label className="text-sm font-medium text-stone-700">
                Vehicle
                <select
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  value={form.carId}
                  required
                  disabled={carsLoading}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, carId: event.target.value }))
                  }
                >
                  <option value="">{carsLoading ? "Loading cars..." : "Select a car"}</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.name}
                    </option>
                  ))}
                </select>
                {carsLoading && <p className="mt-2 text-xs text-stone-500">Fetching available cars from the API.</p>}
              </label>
            ) : (
              <label className="text-sm font-medium text-stone-700">
                Package
                <select
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  value={form.packageId}
                  required
                  disabled={packagesLoading}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, packageId: event.target.value }))
                  }
                >
                  <option value="">{packagesLoading ? "Loading packages..." : "Select a package"}</option>
                  {packages.map((travelPackage) => (
                    <option key={travelPackage._id} value={travelPackage._id}>
                      {travelPackage.name}
                    </option>
                  ))}
                </select>
                {packagesLoading && <p className="mt-2 text-xs text-stone-500">Fetching available packages from the API.</p>}
              </label>
            )}

            <label className="text-sm font-medium text-stone-700">
              Trip Type
              <select
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.tripType}
                onChange={(event) =>
                  setForm((current) => ({ ...current, tripType: event.target.value }))
                }
              >
                <option value="local">Local</option>
                <option value="outstation">Outstation</option>
                <option value="airport">Airport</option>
              </select>
            </label>

            {form.bookingType === "CAR" ? (
              carsLoading ? (
                <div className="md:col-span-2">
                  <InlineFieldLoader label="Car pricing and route options are loading from the API..." />
                </div>
              ) : (
              distanceMode === "manual" ? (
                <div className="rounded-2xl bg-stone-100 px-4 py-4 text-sm text-stone-600 md:col-span-2">
                  We could not estimate this route automatically right now. Please contact us on{" "}
                  <a
                    href={`https://wa.me/${siteConfig.business.whatsappNumber}?text=Hello%20I%20need%20help%20with%20this%20route%20estimate.`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-dune"
                  >
                    WhatsApp
                  </a>{" "}
                  and our team will help you quickly.
                </div>
              ) : null
              )
            ) : (
              packagesLoading ? (
                <div className="md:col-span-2">
                  <InlineFieldLoader label="Package pricing details are loading from the API..." />
                </div>
              ) : (
                <label className="text-sm font-medium text-stone-700">
                  Extra KM
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                    value={form.extraKm}
                    min="0"
                    onChange={(event) =>
                      setForm((current) => ({ ...current, extraKm: event.target.value }))
                    }
                  />
                  <p className="mt-2 text-xs leading-5 text-stone-500">
                    Final price = base package price + extra KM × extra per KM.
                  </p>
                </label>
              )
            )}

            <label className="text-sm font-medium text-stone-700">
              Customer Name
              <input
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.customer.name}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customer: { ...current.customer, name: event.target.value }
                  }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.customer.email}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customer: { ...current.customer, email: event.target.value }
                  }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700 md:col-span-2">
              Phone
              <input
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.customer.phone}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customer: { ...current.customer, phone: event.target.value }
                  }))
                }
              />
            </label>
            <label className="text-sm font-medium text-stone-700 md:col-span-2">
              Notes
              <textarea
                rows="4"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              />
            </label>
            {error && <p className="md:col-span-2 text-sm font-medium text-red-600">{error}</p>}
            {!user && (
              <p className="md:col-span-2 text-sm font-medium text-amber-700">
                You can continue this booking after login without losing your details.
              </p>
            )}
            {!mapsEnabled && form.bookingType === "CAR" && (
              <datalist id="known-locations">
                {knownLocations.map((location) => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="primary-button md:col-span-2 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : form.bookingType === "PACKAGE" ? "Book Package" : "Confirm Booking"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}