import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import api from "../api/client";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  getGeneratedOgImageUrl,
  getGeneratedOgPreviewUrl,
  resolveMediaUrl
} from "../utils/media";

const initialCarForm = {
  name: "",
  brand: "",
  type: "SUV",
  seatingCapacity: 5,
  ac: true,
  pricePerKm: 12,
  minBookingKm: 40,
  luggage: "",
  summary: "",
  description: "",
  highlights: "",
  images: "",
  driverProfile: {
    name: "",
    languages: "",
    experience: "",
    videoUrl: "",
    bio: ""
  },
  featured: true
};

const initialPackageForm = {
  name: "",
  price: 2000,
  duration: "1 Day",
  includedKm: 80,
  extraPerKm: 12,
  description: "",
  heroImage: "",
  ogImage: "",
  featured: true,
  bestSeller: false
};

const initialBlogForm = {
  title: "",
  excerpt: "",
  description: "",
  keywords: "",
  heroImage: "",
  ogImage: "",
  publishedAt: "",
  status: "published",
  sections: [
    {
      heading: "",
      body: ""
    }
  ],
  featured: true
};

export default function DashboardPage() {
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [carForm, setCarForm] = useState(initialCarForm);
  const [packageForm, setPackageForm] = useState(initialPackageForm);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [editingCarId, setEditingCarId] = useState("");
  const [editingPackageId, setEditingPackageId] = useState("");
  const [editingBlogId, setEditingBlogId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [seoSyncResult, setSeoSyncResult] = useState(null);

  const fetchDashboard = async () => {
    const [carsResponse, packagesResponse, blogsResponse, bookingsResponse] = await Promise.all([
      api.get("/cars"),
      api.get("/packages"),
      api.get("/blogs/admin/all"),
      api.get("/bookings")
    ]);

    setCars(carsResponse.data);
    setPackages(packagesResponse.data);
    setBlogs(blogsResponse.data);
    setBookings(bookingsResponse.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpload = async () => {
    if (!uploadFile) return;
    const body = new FormData();
    body.append("file", uploadFile);
    const { data } = await api.post("/uploads", body, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setUploadedUrl(data.fileUrl);
  };

  const handleCarSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...carForm,
      seatingCapacity: Number(carForm.seatingCapacity),
      pricePerKm: Number(carForm.pricePerKm),
      minBookingKm: Number(carForm.minBookingKm),
      highlights: carForm.highlights.split(",").map((item) => item.trim()).filter(Boolean),
      images: carForm.images.split(",").map((item) => item.trim()).filter(Boolean),
      driverProfile: {
        ...carForm.driverProfile,
        languages: carForm.driverProfile.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    };

    if (editingCarId) {
      await api.put(`/cars/${editingCarId}`, payload);
    } else {
      await api.post("/cars", payload);
    }

    setCarForm(initialCarForm);
    setEditingCarId("");
    fetchDashboard();
  };

  const handlePackageSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...packageForm,
      price: Number(packageForm.price),
      includedKm: Number(packageForm.includedKm),
      extraPerKm: Number(packageForm.extraPerKm)
    };

    if (editingPackageId) {
      await api.put(`/packages/${editingPackageId}`, payload);
    } else {
      await api.post("/packages", payload);
    }

    setPackageForm(initialPackageForm);
    setEditingPackageId("");
    fetchDashboard();
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...blogForm,
      keywords: blogForm.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      sections: blogForm.sections
        .map((section) => ({
          heading: section.heading.trim(),
          body: section.body.trim()
        }))
        .filter((section) => section.heading && section.body)
    };

    if (!payload.publishedAt) {
      delete payload.publishedAt;
    }

    if (editingBlogId) {
      await api.put(`/blogs/${editingBlogId}`, payload);
    } else {
      await api.post("/blogs", payload);
    }

    setBlogForm(initialBlogForm);
    setEditingBlogId("");
    fetchDashboard();
  };

  const editCar = (car) => {
    setEditingCarId(car._id);
    setCarForm({
      ...car,
      highlights: car.highlights.join(", "),
      images: car.images.join(", "),
      driverProfile: {
        ...car.driverProfile,
        languages: car.driverProfile.languages.join(", ")
      }
    });
  };

  const editPackage = (travelPackage) => {
    setEditingPackageId(travelPackage._id);
    setPackageForm(travelPackage);
  };

  const editBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      ...blog,
      keywords: (blog.keywords || []).join(", "),
      publishedAt: blog.publishedAt ? String(blog.publishedAt).slice(0, 10) : "",
      sections:
        blog.sections?.length > 0
          ? blog.sections
          : [
              {
                heading: "",
                body: ""
              }
            ]
    });
  };

  const syncSeo = async () => {
    const { data } = await api.post("/seo/sync");
    setSeoSyncResult(data);
  };

  const packagePreviewImage =
    packageForm.heroImage || packageForm.ogImage || "/media/travel-panna.svg";
  const packageGeneratedOg = getGeneratedOgImageUrl(
    "package",
    (packageForm.name || "khajuraho-package")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
  const packagePreviewOg = getGeneratedOgPreviewUrl(
    "package",
    packageForm.name || "Khajuraho Tour Package",
    `From Rs. ${packageForm.price || 0} • ${packageForm.duration || "1 Day"}`
  );
  const blogGeneratedOg = getGeneratedOgImageUrl(
    "blog",
    (blogForm.title || "khajuraho-blog")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
  const blogPreviewOg = getGeneratedOgPreviewUrl(
    "blog",
    blogForm.title || "Khajuraho Travel Blog",
    blogForm.excerpt || blogForm.description || "Travel article preview"
  );
  const blogPreviewSections = blogForm.sections.filter((section) => section.heading || section.body);

  return (
    <>
      <Seo title="Admin Dashboard | Khajuraho Roads" path="/admin" noIndex />
      <main className="section-shell space-y-8 py-12">
        <div className="glass-panel p-8">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-4 font-display text-5xl text-ink">Manage cars, packages, blogs, and bookings</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
            Update customer-facing travel content, upload media, manage package SEO images, create blog articles, and sync search engine indexing from one dashboard.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <form className="glass-panel grid gap-4 p-8 md:grid-cols-2" onSubmit={handleCarSubmit}>
            <h2 className="md:col-span-2 text-2xl font-semibold text-ink">
              {editingCarId ? "Edit car" : "Add new car"}
            </h2>
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Car name" value={carForm.name} onChange={(event) => setCarForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Brand" value={carForm.brand} onChange={(event) => setCarForm((current) => ({ ...current, brand: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Type" value={carForm.type} onChange={(event) => setCarForm((current) => ({ ...current, type: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Seating" value={carForm.seatingCapacity} onChange={(event) => setCarForm((current) => ({ ...current, seatingCapacity: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Price per KM" value={carForm.pricePerKm} onChange={(event) => setCarForm((current) => ({ ...current, pricePerKm: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Minimum booking KM" value={carForm.minBookingKm} onChange={(event) => setCarForm((current) => ({ ...current, minBookingKm: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" placeholder="Luggage" value={carForm.luggage} onChange={(event) => setCarForm((current) => ({ ...current, luggage: event.target.value }))} />
            <textarea className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" rows="3" placeholder="Summary" value={carForm.summary} onChange={(event) => setCarForm((current) => ({ ...current, summary: event.target.value }))} />
            <textarea className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" rows="4" placeholder="Description" value={carForm.description} onChange={(event) => setCarForm((current) => ({ ...current, description: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" placeholder="Highlights comma separated" value={carForm.highlights} onChange={(event) => setCarForm((current) => ({ ...current, highlights: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" placeholder="Image URLs comma separated" value={carForm.images} onChange={(event) => setCarForm((current) => ({ ...current, images: event.target.value }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Driver name" value={carForm.driverProfile.name} onChange={(event) => setCarForm((current) => ({ ...current, driverProfile: { ...current.driverProfile, name: event.target.value } }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Driver languages comma separated" value={carForm.driverProfile.languages} onChange={(event) => setCarForm((current) => ({ ...current, driverProfile: { ...current.driverProfile, languages: event.target.value } }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Driver experience" value={carForm.driverProfile.experience} onChange={(event) => setCarForm((current) => ({ ...current, driverProfile: { ...current.driverProfile, experience: event.target.value } }))} />
            <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Driver video URL" value={carForm.driverProfile.videoUrl} onChange={(event) => setCarForm((current) => ({ ...current, driverProfile: { ...current.driverProfile, videoUrl: event.target.value } }))} />
            <textarea className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" rows="3" placeholder="Driver bio" value={carForm.driverProfile.bio} onChange={(event) => setCarForm((current) => ({ ...current, driverProfile: { ...current.driverProfile, bio: event.target.value } }))} />
            <button type="submit" className="primary-button md:col-span-2">{editingCarId ? "Update car" : "Create car"}</button>
          </form>

          <div className="space-y-8">
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-semibold text-ink">Upload media</h2>
              <div className="mt-5 flex flex-col gap-4">
                <input type="file" onChange={(event) => setUploadFile(event.target.files?.[0] || null)} />
                <button type="button" className="secondary-button" onClick={handleUpload}>
                  Upload file
                </button>
                {uploadedUrl ? (
                  <p className="text-sm text-stone-600">
                    Uploaded URL: <span className="font-medium text-dune">{uploadedUrl}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="glass-panel p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">Search Engine Sync</h2>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    Trigger IndexNow for all key URLs after deployment. Google sitemap ping is no longer supported publicly, so keep the sitemap submitted in Search Console.
                  </p>
                </div>
                <button type="button" className="primary-button" onClick={syncSeo}>
                  Run SEO Sync
                </button>
              </div>
              {seoSyncResult ? (
                <div className="mt-5 rounded-3xl bg-stone-100 p-5 text-sm text-stone-700">
                  <p>Submitted URLs: {seoSyncResult.submittedUrlCount}</p>
                  <p className="mt-2">IndexNow: {seoSyncResult.indexNow?.submitted ? "Success" : seoSyncResult.indexNow?.reason || "Skipped"}</p>
                  <p className="mt-2">{seoSyncResult.googleNote}</p>
                </div>
              ) : null}
            </div>

            <div className="glass-panel p-8">
              <h2 className="text-2xl font-semibold text-ink">Current fleet</h2>
              <div className="mt-6 space-y-4">
                {cars.map((car) => (
                  <div key={car._id} className="rounded-3xl bg-stone-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-ink">{car.name}</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {formatCurrency(car.pricePerKm)}/km • {car.seatingCapacity} seats
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="secondary-button !px-4" onClick={() => editCar(car)}>Edit</button>
                        <button type="button" className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white" onClick={async () => { await api.delete(`/cars/${car._id}`); fetchDashboard(); }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <form className="glass-panel space-y-4 p-8" onSubmit={handlePackageSubmit}>
            <h2 className="text-2xl font-semibold text-ink">{editingPackageId ? "Edit package" : "Add package"}</h2>
            <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Package name" value={packageForm.name} onChange={(event) => setPackageForm((current) => ({ ...current, name: event.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Price" value={packageForm.price} onChange={(event) => setPackageForm((current) => ({ ...current, price: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Duration" value={packageForm.duration} onChange={(event) => setPackageForm((current) => ({ ...current, duration: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Included KM" value={packageForm.includedKm} onChange={(event) => setPackageForm((current) => ({ ...current, includedKm: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Extra per KM" value={packageForm.extraPerKm} onChange={(event) => setPackageForm((current) => ({ ...current, extraPerKm: event.target.value }))} />
            </div>
            <textarea className="w-full rounded-2xl border border-stone-200 px-4 py-3" rows="3" placeholder="Package description" value={packageForm.description} onChange={(event) => setPackageForm((current) => ({ ...current, description: event.target.value }))} />
            <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Hero image URL" value={packageForm.heroImage} onChange={(event) => setPackageForm((current) => ({ ...current, heroImage: event.target.value }))} />
            <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="OG image URL" value={packageForm.ogImage} onChange={(event) => setPackageForm((current) => ({ ...current, ogImage: event.target.value }))} />
            <div className="flex flex-wrap gap-6 text-sm text-stone-700">
              <label className="flex items-center gap-2"><input type="checkbox" checked={packageForm.featured} onChange={(event) => setPackageForm((current) => ({ ...current, featured: event.target.checked }))} />Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={packageForm.bestSeller} onChange={(event) => setPackageForm((current) => ({ ...current, bestSeller: event.target.checked }))} />Best Seller</label>
            </div>
            <button type="submit" className="primary-button w-full">{editingPackageId ? "Update package" : "Create package"}</button>
            <div className="grid gap-4 pt-2 md:grid-cols-2">
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">Hero Preview</p>
                <img src={resolveMediaUrl(packagePreviewImage)} alt="Package hero preview" className="mt-3 h-40 w-full rounded-2xl object-cover" />
              </div>
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">Generated OG Preview</p>
                <img src={packageForm.ogImage ? resolveMediaUrl(packageForm.ogImage) : packagePreviewOg || packageGeneratedOg} alt="Package OG preview" className="mt-3 h-40 w-full rounded-2xl object-cover" />
              </div>
            </div>
          </form>

          <div className="glass-panel p-8">
            <h2 className="text-2xl font-semibold text-ink">Current packages</h2>
            <div className="mt-6 space-y-4">
              {packages.map((travelPackage) => (
                <div key={travelPackage._id} className="rounded-3xl bg-stone-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-ink">{travelPackage.name}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {formatCurrency(travelPackage.price)} • {travelPackage.includedKm} km • {formatCurrency(travelPackage.extraPerKm)}/km extra
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="secondary-button !px-4" onClick={() => editPackage(travelPackage)}>Edit</button>
                      <button type="button" className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white" onClick={async () => { await api.delete(`/packages/${travelPackage._id}`); fetchDashboard(); }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <form className="glass-panel space-y-4 p-8" onSubmit={handleBlogSubmit}>
            <h2 className="text-2xl font-semibold text-ink">{editingBlogId ? "Edit blog" : "Add blog article"}</h2>
            <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Blog title" value={blogForm.title} onChange={(event) => setBlogForm((current) => ({ ...current, title: event.target.value }))} />
            <textarea className="w-full rounded-2xl border border-stone-200 px-4 py-3" rows="3" placeholder="Excerpt" value={blogForm.excerpt} onChange={(event) => setBlogForm((current) => ({ ...current, excerpt: event.target.value }))} />
            <textarea className="w-full rounded-2xl border border-stone-200 px-4 py-3" rows="3" placeholder="SEO description" value={blogForm.description} onChange={(event) => setBlogForm((current) => ({ ...current, description: event.target.value }))} />
            <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" placeholder="Keywords comma separated" value={blogForm.keywords} onChange={(event) => setBlogForm((current) => ({ ...current, keywords: event.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="Hero image URL" value={blogForm.heroImage} onChange={(event) => setBlogForm((current) => ({ ...current, heroImage: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 px-4 py-3" placeholder="OG image URL" value={blogForm.ogImage} onChange={(event) => setBlogForm((current) => ({ ...current, ogImage: event.target.value }))} />
              <input type="date" className="rounded-2xl border border-stone-200 px-4 py-3 md:col-span-2" value={blogForm.publishedAt} onChange={(event) => setBlogForm((current) => ({ ...current, publishedAt: event.target.value }))} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-stone-700">Article Sections</p>
                <button
                  type="button"
                  className="secondary-button !px-4 !py-2"
                  onClick={() =>
                    setBlogForm((current) => ({
                      ...current,
                      sections: [...current.sections, { heading: "", body: "" }]
                    }))
                  }
                >
                  Add Section
                </button>
              </div>
              {blogForm.sections.map((section, index) => (
                <div key={`${index}-${section.heading}`} className="rounded-3xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">Section {index + 1}</p>
                    {blogForm.sections.length > 1 ? (
                      <button
                        type="button"
                        className="text-sm font-semibold text-red-600"
                        onClick={() =>
                          setBlogForm((current) => ({
                            ...current,
                            sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index)
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <input
                    className="mt-3 w-full rounded-2xl border border-stone-200 px-4 py-3"
                    placeholder="Section heading"
                    value={section.heading}
                    onChange={(event) =>
                      setBlogForm((current) => ({
                        ...current,
                        sections: current.sections.map((item, sectionIndex) =>
                          sectionIndex === index ? { ...item, heading: event.target.value } : item
                        )
                      }))
                    }
                  />
                  <textarea
                    className="mt-3 w-full rounded-2xl border border-stone-200 px-4 py-3"
                    rows="4"
                    placeholder="Section content"
                    value={section.body}
                    onChange={(event) =>
                      setBlogForm((current) => ({
                        ...current,
                        sections: current.sections.map((item, sectionIndex) =>
                          sectionIndex === index ? { ...item, body: event.target.value } : item
                        )
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" checked={blogForm.featured} onChange={(event) => setBlogForm((current) => ({ ...current, featured: event.target.checked }))} />
                Featured article
              </label>
              <label className="text-sm font-medium text-stone-700">
                Status
                <select
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  value={blogForm.status}
                  onChange={(event) => setBlogForm((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>
            <button type="submit" className="primary-button w-full">{editingBlogId ? "Update article" : "Create article"}</button>
          </form>

          <div className="glass-panel p-8">
            <h2 className="text-2xl font-semibold text-ink">Blog Editor Preview</h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">Hero Image</p>
                <img
                  src={resolveMediaUrl(blogForm.heroImage || "/media/travel-khajuraho.svg")}
                  alt="Blog hero preview"
                  className="mt-3 h-44 w-full rounded-2xl object-cover"
                />
              </div>
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">Social Preview</p>
                <img
                  src={blogForm.ogImage ? resolveMediaUrl(blogForm.ogImage) : blogPreviewOg || blogGeneratedOg}
                  alt="Generated blog OG preview"
                  className="mt-3 h-44 w-full rounded-2xl object-cover"
                />
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-dune">
                  {blogForm.status === "draft" ? "Draft Preview" : "Published Preview"}
                </p>
                <h3 className="mt-4 font-display text-3xl text-ink">
                  {blogForm.title || "Your article title will appear here"}
                </h3>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {blogForm.excerpt || "Short article summary preview"}
                </p>
                <div className="mt-6 space-y-4">
                  {blogPreviewSections.length > 0 ? (
                    blogPreviewSections.map((section, index) => (
                      <div key={`${section.heading}-${index}`} className="rounded-2xl bg-stone-50 p-4">
                        <p className="text-lg font-semibold text-ink">{section.heading || "Section heading"}</p>
                        <p className="mt-2 text-sm leading-7 text-stone-600">{section.body || "Section copy preview"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                      Add sections to preview the article layout.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h2 className="mt-10 text-2xl font-semibold text-ink">Blog articles</h2>
            <div className="mt-6 space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="rounded-3xl bg-stone-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-ink">{blog.title}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {new Date(blog.publishedAt).toLocaleDateString("en-IN")} • /blog/{blog.slug}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-dune">
                        {blog.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="secondary-button !px-4" onClick={() => editBlog(blog)}>Edit</button>
                      <button type="button" className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white" onClick={async () => { await api.delete(`/blogs/${blog._id}`); fetchDashboard(); }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-8">
          <h2 className="text-2xl font-semibold text-ink">Bookings</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="px-4 py-3">Booking</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Car</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Fare</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-stone-100">
                    <td className="px-4 py-4 font-medium text-ink">{booking.bookingNumber}</td>
                    <td className="px-4 py-4">
                      <p>{booking.customer.name}</p>
                      <p className="text-stone-500">{booking.customer.phone}</p>
                    </td>
                    <td className="px-4 py-4">{booking.car?.name}</td>
                    <td className="px-4 py-4">{booking.packageName || booking.package?.name || "-"}</td>
                    <td className="px-4 py-4">{formatDate(booking.travelDate)}</td>
                    <td className="px-4 py-4">{formatCurrency(booking.totalPrice)}</td>
                    <td className="px-4 py-4">
                      <select
                        className="rounded-full border border-stone-200 px-3 py-2"
                        value={booking.status}
                        onChange={async (event) => {
                          await api.patch(`/bookings/${booking._id}/status`, {
                            status: event.target.value
                          });
                          fetchDashboard();
                        }}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
