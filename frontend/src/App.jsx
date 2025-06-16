import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { Slideshow } from "./pages/user/router";
import { UserLayout } from "./components/layouts/user/userlayout";
import { AdminLayout } from "./components/layouts/admin/adminlayout";
import { ProtectedRoute } from "./services/ProtectedRoute";
import { UserHome, UserSachnoi, UserSachdientu } from "./pages/user/router";
// router admin
import { Home, User, Categories, Create_category, Roles, Update_Role, Create_role, Accounts, Set_Role_Account } from "./pages/admin/router";
import { Notfound404 } from "./components/notfound404";

import Book_Types from "./pages/admin/book_types";
import Create_booktype from "./pages/admin/book_types/create";
import Update_Booktype from "./pages/admin/book_types/update";

import Books from "./pages/admin/books";
import Create_Book from "./pages/admin/books/create";

import Chapters from "./pages/admin/chapters";
import Create_Chapter from "./pages/admin/chapters/create";

import Update_Category from "./pages/admin/categories/update";
// -------------------------------
function App() {

  const adminRoutes = [
    { path: 'user', element: < User /> },

    { path: 'accounts', element: < Accounts /> },
    { path: 'accounts/rolelevel/:userId', element: < Set_Role_Account /> },

    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },

    { path: 'book-types', element: < Book_Types /> },
    { path: 'book-types/create', element: < Create_booktype /> },
    { path: 'book-types/update/:bookTypeId', element: < Update_Booktype /> },

    { path: 'books', element: < Books /> },
    { path: 'books/create', element: < Create_Book /> },

    { path: 'books/chapters/:bookId', element: < Chapters /> },
    { path: 'books/chapters/create/:bookId', element: < Create_Chapter /> },

    { path: 'roles', element: < Roles /> },
    { path: 'roles/update/:roleId', element: < Update_Role /> },
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
