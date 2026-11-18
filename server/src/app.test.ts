import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";

const ORIGIN = "http://localhost:5173";

describe("DevConnect API Tests", () => {

  // Health Check
  it("GET /api/health should return 200 OK", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Registration Validation
  it("POST /api/auth/register should return 400 when fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Origin", ORIGIN)
      .send({
        name: "",
        email: "",
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Login Validation
  it("POST /api/auth/login should return 400 when fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Origin", ORIGIN)
      .send({
        email: "",
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Protected Route
  it("GET /api/auth/profile should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/auth/profile");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // Logout
  it("POST /api/auth/logout should return 200 OK", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Origin", ORIGIN);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // PROJECT API SECURITY TESTS

  it("GET /api/projects should return 401 without token", async () => {
    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(401);
  });

  it("POST /api/projects should return 401 without token", async () => {
    const response = await request(app)
      .post("/api/projects")
      .set("Origin", ORIGIN)
      .send({
        title: "Test Project",
        description: "Testing project",
        techStack: ["React", "Node.js"],
      });

    expect(response.status).toBe(401);
  });

  it("GET /api/projects/:id should return 401 without token", async () => {
    const response = await request(app).get("/api/projects/test-id");

    expect(response.status).toBe(401);
  });

  it("PUT /api/projects/:id should return 401 without token", async () => {
    const response = await request(app)
      .put("/api/projects/test-id")
      .set("Origin", ORIGIN)
      .send({ title: "Updated Project" });

    expect(response.status).toBe(401);
  });

  it("DELETE /api/projects/:id should return 401 without token", async () => {
    const response = await request(app)
      .delete("/api/projects/test-id")
      .set("Origin", ORIGIN);

    expect(response.status).toBe(401);
  });

  // BLOG API SECURITY TESTS

  it("GET /api/blogs should return 401 without token", async () => {
    const response = await request(app).get("/api/blogs");

    expect(response.status).toBe(401);
  });

  it("POST /api/blogs should return 401 without token", async () => {
    const response = await request(app)
      .post("/api/blogs")
      .set("Origin", ORIGIN)
      .send({
        title: "Test Blog",
        content: "Testing blog security",
      });

    expect(response.status).toBe(401);
  });

  it("GET /api/blogs/slug/:slug should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/blogs/slug/test-blog");

    expect(response.status).toBe(401);
  });

  it("PUT /api/blogs/:id should return 401 without token", async () => {
    const response = await request(app)
      .put("/api/blogs/test-id")
      .set("Origin", ORIGIN)
      .send({
        title: "Updated Blog",
      });

    expect(response.status).toBe(401);
  });

  // CONNECTION API SECURITY TESTS

  it("POST /api/connections/request/:id should return 401 without token", async () => {
    const response = await request(app)
      .post("/api/connections/request/test-user")
      .set("Origin", ORIGIN);

    expect(response.status).toBe(401);
  });

  it("PATCH /api/connections/:id/accept should return 401 without token", async () => {
    const response = await request(app)
      .patch("/api/connections/test-id/accept")
      .set("Origin", ORIGIN);

    expect(response.status).toBe(401);
  });

  it("PATCH /api/connections/:id/reject should return 401 without token", async () => {
    const response = await request(app)
      .patch("/api/connections/test-id/reject")
      .set("Origin", ORIGIN);

    expect(response.status).toBe(401);
  });

  it("GET /api/connections/pending should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/connections/pending");

    expect(response.status).toBe(401);
  });

  it("GET /api/connections/sent should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/connections/sent");

    expect(response.status).toBe(401);
  });

  it("GET /api/connections should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/connections");

    expect(response.status).toBe(401);
  });

  it("GET /api/connections/mutual/:id should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/connections/mutual/test-user");

    expect(response.status).toBe(401);
  });

  // DASHBOARD API SECURITY TEST

  it("GET /api/dashboard/stats should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/dashboard/stats");

    expect(response.status).toBe(401);
  });

  // ACTIVITY API SECURITY TEST

  it("GET /api/activities should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/activities");

    expect(response.status).toBe(401);
  });
  it("should block requests from unauthorized origins", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .set("Origin", "https://malicious-site.com")
    .send({
      email: "test@example.com",
      password: "password123",
    });

  expect(response.status).toBe(403);
  expect(response.body.success).toBe(false);
});
});