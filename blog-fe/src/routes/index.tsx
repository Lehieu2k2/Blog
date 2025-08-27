import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "../components/layout/ProtectedLayout";
import Login from "../pages/auth/Login";
import CategoryPage from "../pages/category/CategoryPage";
import PostPage from "../pages/post/PostPage";
import UserPage from "../pages/user/UserPage";
import PublicRoute from "./PublicRoute";
export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: (
      <PublicRoute restricted={true}>
        <Login />
      </PublicRoute>
    ),
  },

  // Protected Routes - All wrapped with PrivateRoute + MainLayout
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true, // This matches "/"
        element: <UserPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "post",
        element: <PostPage />,
      },
      {
        path: "category",
        element: <CategoryPage />,
      },
    ],
  },

  // 404 Route - No authentication needed
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600">Page not found</p>
        </div>
      </div>
    ),
  },
]);
