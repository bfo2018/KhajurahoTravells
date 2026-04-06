import { Menu, Phone } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { siteConfig } from "../utils/siteConfig";

const links = [
  { label: "Home", to: "/" },
  { label: "Cars", to: "/cars" },
  { label: "Packages", to: "/packages" },
  { label: "Blog", to: "/blog" },
  { label: "Gallery", to: "/gallery" },
  { label: "Booking", to: "/booking" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-dune to-bronze text-white shadow-soft">
            KR
          </div>
          <div>
            <p className="text-lg font-bold text-ink">Khajuraho Roads</p>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Tour & Travels
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "font-semibold text-dune" : "font-medium text-stone-600"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a href={`tel:${siteConfig.business.phone.replace(/\s+/g, "")}`} className="secondary-button gap-2">
            <Phone size={16} />
            Call Now
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== "admin" && <Link to="/my-bookings" className="secondary-button">My Bookings</Link>}
              {user.role === "admin" && <Link to="/admin" className="primary-button">Admin</Link>}
              <button type="button" className="secondary-button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="primary-button">
              Login
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="rounded-full border border-stone-200 p-3 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="section-shell space-y-3 border-t border-stone-100 py-4 lg:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-stone-700 hover:bg-stone-100"
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role !== "admin" && (
            <Link
              to="/my-bookings"
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-stone-700 hover:bg-stone-100"
            >
              My Bookings
            </Link>
          )}
          <Link to="/login" onClick={() => setOpen(false)} className="primary-button w-full">
            {user ? "Account" : "Login"}
          </Link>
        </div>
      )}
    </header>
  );
}
