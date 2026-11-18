import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));

const Blogs = lazy(() => import("./pages/Blogs"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const EditBlog = lazy(() => import("./pages/EditBlog"));

const Developers = lazy(() => import("./pages/Developers"));
const DeveloperProfile = lazy(
  () => import("./pages/DeveloperProfile")
);

const Connections = lazy(() => import("./pages/Connection"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const ProtectedRoute = lazy(
  () => import("./components/ProtectedRoute")
);

// Loading Component
const Loading = () => {
  return (
    <div className="app-loading">
      <h2>DevConnect</h2>
      <p>Loading page...</p>
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<Profile />} />

          {/* Blog Routes */}
          <Route path="/blogs" element={<Blogs />} />

          <Route
            path="/blogs/create"
            element={<CreateBlog />}
          />

          <Route
            path="/blogs/:slug/edit"
            element={<EditBlog />}
          />

          <Route
            path="/blogs/:slug"
            element={<BlogDetails />}
          />

          {/* Developer Routes */}
          <Route
            path="/developers"
            element={<Developers />}
          />

          <Route
            path="/developers/:id"
            element={<DeveloperProfile />}
          />

          {/* Connection Routes */}
          <Route
            path="/connections"
            element={<Connections />}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;