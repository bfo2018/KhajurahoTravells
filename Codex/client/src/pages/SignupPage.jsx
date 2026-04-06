import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(form);
      navigate(location.state?.redirectTo || "/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to sign up");
    }
  };

  return (
    <>
      <Seo title="Signup | Khajuraho Roads" path="/signup" noIndex />
      <main className="section-shell py-12">
        <div className="mx-auto max-w-lg glass-panel p-8">
          <p className="eyebrow">New Customer</p>
          <h1 className="mt-4 font-display text-4xl text-ink">Create your account</h1>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              placeholder="Full name"
              className="w-full rounded-2xl border border-stone-200 px-4 py-3"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-stone-200 px-4 py-3"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-2xl border border-stone-200 px-4 py-3"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-stone-200 px-4 py-3"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="primary-button w-full">
              Create Account
            </button>
          </form>
          <p className="mt-4 text-sm text-stone-600">
            Already registered?{" "}
            <Link to="/login" state={location.state} className="text-dune">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
