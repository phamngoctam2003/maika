import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { SlideShow } from "@components/user/sliderShow/sliderShow";
import { UserLayout } from "./components/layouts/user/userlayout";
import { AdminLayout } from "./components/layouts/admin/adminlayout";
import { ProtectedRoute } from "./services/ProtectedRoute";
import SachNoi from "./pages/user/sach_noi/sach_noi";
import Ebook from "./pages/user/ebook/ebook";
import EbookCategory from "./pages/user/ebook/category";
import AudioCategory from "./pages/user/sach_noi/category";
import UserHome from "./pages/user/userhome";
// router admin
import { Home, User, Categories, Create_category, Roles, Update_Role, Create_role, Accounts, Set_Role_Account } from "./pages/admin/router";

import Payment from "./pages/admin/payment";
import Update_Payment from "./pages/admin/payment/update";

import Banners from "./pages/admin/banners";
import Create_banner from "./pages/admin/banners/create";

import Packages from "./pages/admin/packages";
import CreatePackage from "./pages/admin/packages/create";
import UpdatePackage from "./pages/admin/packages/update";

import ResetPassword from "./components/auth/resetPassword";

import { Notfound404 } from "./components/global/notfound404";
import EbookDetail from "./pages/user/book_detail/ebook";
import SachNoiDetail from "./pages/user/book_detail/sach_noi";

import BookReader from "./pages/user/book_reader";

import Books from "./pages/admin/books";
import Create_Book from "./pages/admin/books/create";
import Update_Book from "./pages/admin/books/update";

import Chapters from "./pages/admin/chapters";
import Create_Chapter from "./pages/admin/chapters/create";
import Update_Chapter from "./pages/admin/chapters/update";


import Update_Category from "./pages/admin/categories/update";

import BookFree from "./pages/user/book_free/index";
import BookMember from "./pages/user/book_member/index";
import PackagePlan from "./pages/user/package_plan/package_plan";

import ProfileManagement from "@/pages/user/profile/ProfileManagement";
import BookCase from "@/pages/user/profile/BookCase";
import TransactionHistories from "@/pages/user/profile/transaction-histories";

import AudioPlayer from "@/pages/test/test_audio";
import Search from "@/pages/user/search/search";
// -------------------------------
function App() {

  const adminRoutes = [
    { path: 'user', element: < User /> },

    { path: 'payments', element: < Payment /> },
    { path: 'payments/update/:id', element: < Update_Payment /> },

    { path: 'packages', element: < Packages /> },
    { path: 'packages/create', element: < CreatePackage /> },
    { path: 'packages/update/:id', element: < UpdatePackage /> },

    { path: 'banners', element: < Banners /> },
    { path: 'banners/create', element: < Create_banner /> },

    { path: 'accounts', element: < Accounts /> },
    { path: 'accounts/rolelevel/:userId', element: < Set_Role_Account /> },

    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },

    { path: 'books', element: < Books /> },
    { path: 'books/create', element: < Create_Book /> },
    { path: 'books/update/:id', element: < Update_Book /> },

    { path: 'books/chapters/:bookId', element: < Chapters /> },
    { path: 'books/chapters/create/:bookId', element: < Create_Chapter /> },
    { path: 'books/chapters/update/:chapterId', element: < Update_Chapter /> },

    { path: 'roles', element: < Roles /> },
    { path: 'roles/update/:roleId', element: < Update_Role /> },
    { path: 'roles/create', element: < Create_role /> },

  ];

  const userRoutes = [
    { path: "ebook/:slug", element: <EbookDetail /> },
    { path: "sach-noi/:slug", element: <SachNoiDetail /> },
    { path: "ebook", element: <Ebook /> },
    { path: "sach-noi", element: <SachNoi /> },
    { path: "sach-noi/category/:slug", element: <AudioCategory /> },
    { path: "ebook/category/:slug", element: <EbookCategory /> },
    { path: "book-free", element: <BookFree /> },
    { path: "book-member", element: <BookMember /> },

    { path: "reader/:slug", element: <BookReader /> },
    { path: "package-plan", element: <PackagePlan /> },
    // { path: "lazyload", element: <LazyLoadDemo /> },

    { path: "profile", element: <ProfileManagement /> },
    { path: "profile/book-case", element: <BookCase /> },
    { path: "profile/transaction-histories", element: <TransactionHistories /> },
    { path: "/search", element: <Search /> },
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
              <SlideShow />
              <UserHome />
            </>
        },
        ...userRoutes,
      ]
    },
    {
      path: "reset-password",
      element: <ResetPassword />,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App
