import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(form);
      const redirectTo = location.state?.redirectTo || "/";
      navigate(data.user.role === "admin" ? "/admin" : redirectTo);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to login");
    }
  };

  return (
    <>
      <Seo title="Login | Khajuraho Roads" path="/login" noIndex />
      <main className="section-shell py-12">
        <div className="mx-auto max-w-lg glass-panel p-8">
          <p className="eyebrow">Welcome Back</p>
          <h1 className="mt-4 font-display text-4xl text-ink">Login to continue</h1>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-stone-200 px-4 py-3"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
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
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-stone-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" state={location.state} className="text-dune">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
