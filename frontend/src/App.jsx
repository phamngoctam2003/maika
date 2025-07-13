import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { Slideshow } from "./pages/user/router";
import { UserLayout } from "./components/layouts/user/userlayout";
import { AdminLayout } from "./components/layouts/admin/adminlayout";
import { ProtectedRoute } from "./services/ProtectedRoute";
import {UserSachnoi, UserSachdientu } from "./pages/user/router";
import UserHome from "./pages/user/userhome";
// router admin
import { Home, User, Categories, Create_category, Roles, Update_Role, Create_role, Accounts, Set_Role_Account } from "./pages/admin/router";
import { Notfound404 } from "./components/global/notfound404";
import BookDetail from "./pages/user/book_detail/book_detail";

import BookReader from "./pages/user/book_reader";

import Books from "./pages/admin/books";
import Create_Book from "./pages/admin/books/create";

import Chapters from "./pages/admin/chapters";
import Create_Chapter from "./pages/admin/chapters/create";

import Update_Category from "./pages/admin/categories/update";

import LazyLoadDemo from "@components/demo/LazyLoadDemo";

import PackagePlan from "./pages/user/package_plan/package_plan";
// -------------------------------
function App() {

  const adminRoutes = [
    { path: 'user', element: < User /> },

    { path: 'accounts', element: < Accounts /> },
    { path: 'accounts/rolelevel/:userId', element: < Set_Role_Account /> },

    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },

    { path: 'books', element: < Books /> },
    { path: 'books/create', element: < Create_Book /> },

    { path: 'books/chapters/:bookId', element: < Chapters /> },
    { path: 'books/chapters/create/:bookId', element: < Create_Chapter /> },

    { path: 'roles', element: < Roles /> },
    { path: 'roles/update/:roleId', element: < Update_Role /> },
    { path: 'roles/create', element: < Create_role /> },

  ];

  const userRoutes = [
    { path: "ebook/:slug", element: <BookDetail /> },
    { path: "sachdientu", element: <UserSachdientu /> },
    { path: "sachnoi", element: <UserSachnoi /> },
    { path: "reader/:slug", element: <BookReader /> },
    { path: "package-plan", element: <PackagePlan /> },
    // { path: "lazyload", element: <LazyLoadDemo /> },
  ];
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <ProtectedRoute role={['user']}>
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
