import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";

import Developers from "./pages/Developers";
import DeveloperProfile from "./pages/DeveloperProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Profile />} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:slug/edit" element={<EditBlog />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />

        {/* Developer Routes */}
        <Route path="/developers" element={<Developers />} />
        <Route
          path="/developers/:id"
          element={<DeveloperProfile />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;