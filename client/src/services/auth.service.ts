import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/auth`;

// Safely handle JSON and plain-text responses
const handleResponse = async (response: Response) => {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Something went wrong" };
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

// User Login
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

// User Registration
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(response);
};