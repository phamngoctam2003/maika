import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { Slideshow } from "./pages/user/router";
import { UserLayout } from "./layouts/user/userlayout";
import { AdminLayout } from "./layouts/admin/adminlayout";
import { ProtectedRoute } from "./services/ProtectedRoute";
import { UserHome, UserSachnoi, UserSachdientu } from "./pages/user/router";
// router admin
import { Home, User, Categories, Create_category, Roles, UpdateRole, Create_role } from "./pages/admin/router";
// -------------------------------
import { Notfound404 } from "./components/notfound404";
function App() {

  const adminRoutes = [
    { path: 'user', element: < User /> },
    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'roles', element: < Roles /> },
    { path: 'roles/update/:roleId', element: < UpdateRole /> },
    { path: 'roles/create', element: < Create_role /> },

  ];

  const userRoutes = [
    { path: "sachdientu", element: <UserSachdientu /> },
    { path: "sachnoi", element: <UserSachnoi /> },
  ];
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <ProtectedRoute role={['admin', 'editor']}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, element:
            <>
              < Home />
            </>
        },
        ...adminRoutes,
      ]
    },
    {
      path: "/",
      element: (
        <UserLayout />
      ),
      errorElement: <Notfound404 />,
      children: [
        {
          index: true, element:
            <>
              <Slideshow />
              <UserHome />
            </>
        },
        ...userRoutes,
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App
