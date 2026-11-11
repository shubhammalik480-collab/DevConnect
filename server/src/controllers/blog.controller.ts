import { Request, Response } from "express";
import prisma from "../config/database";

// Generate URL-friendly slug
const generateSlug = (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseSlug}-${Date.now()}`;
};

// CREATE BLOG
export const createBlog = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const {
      title,
      content,
      excerpt,
      coverImage,
      published,
    } = req.body;

    if (
      !title ||
      typeof title !== "string" ||
      !title.trim() ||
      !content ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const slug = generateSlug(title);

    const blog = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        content,
        excerpt,
        coverImage,
        published: published === true,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

// GET ALL BLOGS
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const blogs = await prisma.blogPost.findMany({
      where: {
        OR: [
          { published: true },
          { userId },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

// GET SINGLE BLOG
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const slug = req.params.slug as string;

    const blog = await prisma.blogPost.findFirst({
      where: {
        slug,
        OR: [
          { published: true },
          { userId },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

// UPDATE BLOG
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const id = req.params.id as string;

    const {
      title,
      content,
      excerpt,
      coverImage,
      published,
    } = req.body;

    const existingBlog = await prisma.blogPost.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or access denied",
      });
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Title must be a non-empty string",
      });
    }

    if (
      content !== undefined &&
      (typeof content !== "string" || !content.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Content must be a non-empty string",
      });
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && {
          published: published === true,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};