const API_URL = "http://localhost:5000/api/blogs";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

// Create Blog
export const createBlog = async (blog: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}): Promise<Blog> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(blog),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create blog");
  }

  return result.data;
};

// Get All Blogs
export const getBlogs = async (): Promise<Blog[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch blogs");
  }

  return result.data;
};

// Get Single Blog
export const getBlogBySlug = async (
  slug: string
): Promise<Blog> => {
  const response = await fetch(
    `${API_URL}/slug/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch blog");
  }

  return result.data;
};

// Update Blog
export const updateBlog = async (
  id: string,
  blog: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
  }
): Promise<Blog> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(blog),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update blog");
  }

  return result.data;
}; 