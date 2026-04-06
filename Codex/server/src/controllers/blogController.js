import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { submitIndexNowUrls } from "../services/indexNowService.js";
import { slugify } from "../utils/slugify.js";

function blogUrls(blog) {
  const slug = blog.slug || slugify(blog.title);
  return [`${env.siteUrl}/blog`, `${env.siteUrl}/blog/${slug}`];
}

export async function getBlogs(_req, res, next) {
  try {
    const blogs = await Blog.find({ status: "published" }).sort({ publishedAt: -1, updatedAt: -1 });
    await Promise.all(
      blogs
        .filter((blog) => !blog.slug)
        .map((blog) => {
          blog.slug = slugify(blog.title);
          return blog.save();
        })
    );
    res.json(blogs);
  } catch (error) {
    next(error);
  }
}

export async function getAdminBlogs(_req, res, next) {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1, publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
}

export async function getBlogBySlug(req, res, next) {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
}

export async function createBlog(req, res, next) {
  try {
    const blog = await Blog.create(req.body);
    if (blog.status === "published") {
      await submitIndexNowUrls(blogUrls(blog)).catch(() => null);
    }
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
}

export async function updateBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    await submitIndexNowUrls(
      blog.status === "published" ? blogUrls(blog) : [`${env.siteUrl}/blog`]
    ).catch(() => null);
    res.json(blog);
  } catch (error) {
    next(error);
  }
}

export async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      await submitIndexNowUrls([`${env.siteUrl}/blog`]).catch(() => null);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
