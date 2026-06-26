import UserProvider from "./Context/UserProvider";
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import PanelAdminLayout from "./Layouts/PanelAdminLayout";

// Public pages
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import RolsPage from "./pages/RolsPage";
import QuestionPage from "./pages/QuestionPage";
import NotFoundPage from "./pages/NotFoundPage";
import ComponentQeshm from "./components/ReserveCar.tsx/Pages/QeshmPage";
import ComponentSary from "./components/ReserveCar.tsx/Pages/SaryPage";
import ShirazPage from "./components/ReserveCar.tsx/Pages/ShirazPage";
import TabrizPage from "./components/ReserveCar.tsx/Pages/TabrizPage";
import MashhadPage from "./components/ReserveCar.tsx/Pages/MashhadPage";
import Nayshaboor from "./components/ReserveCar.tsx/Pages/Nayshaboor";
import YazdPage from "./components/ReserveCar.tsx/Pages/YazdPage";
import BlogDetail from "./components/Main/Blog/BlogDetail";
import BlogPage from "./pages/BlogPage";
import DetailArticle from "./components/Main/Article/DetailArticle";
import ProductComponent from "./components/Product/ProductComponent";
import DetailCar from "./ShopCart/DetailCar";
import BasketComponent from "./components/Basket/BasketComponent";
import ForbiddenPage from "./pages/ForbiddenPage";

// Auth pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Dashboard pages
import AddressPages from "./pages/AddressPages";
import ReservePages from "./pages/ReservePages";
import CardPages from "./pages/CardPages";
import LogoutPage from "./pages/LogoutPage";
import ComponentFormUpdateUser from "./components/Dashboard/ComponentFormUpdateUser";
import ComponnetUpdetePassword from "./components/Dashboard/ComponnetUpdetePassword";
import Profile from "./pages/Profile";
import FavoriteCarPage from "./components/Dashboard/FavoriteCarPage";

// Admin panel pages
import DetalisUserPage from "./pages/DetalisUserPage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import UsersPage from "./pages/UsersPage";
import DescriptionRolePage from "./pages/DescriptionRolePage";
import CreatCustomRolePage from "./pages/CreatCustomRolePage";
import RolesPage from "./pages/RolesPage";
import { GaurdRoute } from "./Routes/GaurdRoute";
import CreateCategory from "./components/PanelAdmin/CategoryForm/CreateCategory";
import UpdateCategory from "./components/PanelAdmin/CategoryForm/UpdateCategory";
import ComponentCreatpoduct from "./components/PanelAdmin/ProductForm/ComponentCreatpoduct";
import ComponentUpdateProduct from "./components/PanelAdmin/ProductForm/ComponentUpdateProduct";
import ComponentImgProduct from "./components/PanelAdmin/ProductForm/ComponentImgProduct";
import ComponentTableComment from "./components/CommentForm/ComponentTableComment";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* ------- Public Layout ------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/roles" element={<RolsPage />} />
          <Route path="/questionPage" element={<QuestionPage />} />
          <Route path="/reserve/qeshm" element={<ComponentQeshm />} />
          <Route path="/reserve/sary" element={<ComponentSary />} />
          <Route path="/reserve/shiraz" element={<ShirazPage />} />
          <Route path="/reserve/tabriz" element={<TabrizPage />} />
          <Route path="/reserve/mashhad" element={<MashhadPage />} />
          <Route path="/reserve/Yazd" element={<YazdPage />} />
          <Route path="/reserve/neyshaboor" element={<Nayshaboor />} />
          <Route path="/articles/:id" element={<DetailArticle />} />
          <Route path="/category/:slug" element={<ProductComponent />} />
          <Route path="/detailcar/:slug" element={<DetailCar />} />
          <Route path="/basket" element={<BasketComponent />} />
        </Route>

        {/* ------- Auth Layout ------- */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ------- Dashboard Layout (User Panel) ------- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="address" element={<AddressPages />} />
          <Route path="reserve" element={<ReservePages />} />
          <Route path="card" element={<CardPages />} />
          <Route path="logout" element={<LogoutPage />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="updatePassword" element={<ComponnetUpdetePassword />} />
          <Route path="updateUser" element={<ComponentFormUpdateUser />} />
          <Route path="favorite_cars" element={<FavoriteCarPage />} />
        </Route>

        {/* ------- Panel Admin Layout ------- */}
        <Route path="/panel" element={<PanelAdminLayout />}>
          {/* Users */}
          <Route
            path="users"
            element={
              <GaurdRoute requiredPermission="user.view">
                <UsersPage />
              </GaurdRoute>
            }
          />
          <Route
            path="users/detail/:userId"
            element={
              <GaurdRoute requiredPermission="user.view">
                <DetalisUserPage />
              </GaurdRoute>
            }
          />
          <Route
            path="users/detail/:userId/description"
            element={
              <GaurdRoute requiredPermission="user.view">
                <DescriptionRolePage />
              </GaurdRoute>
            }
          />

          <Route
            path="category"
            element={
              <GaurdRoute requiredPermission="category.view">
                <CategoryPage />
              </GaurdRoute>
            }
          />
          <Route
            path="category/update/:id"
            element={
              <GaurdRoute requiredPermission="category.update">
                <UpdateCategory />
              </GaurdRoute>
            }
          />
          <Route
            path="category/CreatCategory"
            element={
              <GaurdRoute requiredPermission="category.create">
                <CreateCategory />
              </GaurdRoute>
            }
          />

          {/* Product */}
          <Route
            path="product"
            element={
              <GaurdRoute requiredPermission="product.view">
                <ProductPage />
              </GaurdRoute>
            }
          />
          <Route
            path="product/creatproduct"
            element={
              <GaurdRoute requiredPermission="product.create">
                <ComponentCreatpoduct />
              </GaurdRoute>
            }
          />
          <Route
            path="product/updateproduct/:slug"
            element={
              <GaurdRoute requiredPermission="product.update">
                <ComponentUpdateProduct />
              </GaurdRoute>
            }
          />
          <Route
            path="product/updateImg/:id"
            element={
              <GaurdRoute requiredPermission="product.update">
                <ComponentImgProduct />
              </GaurdRoute>
            }
          />
          <Route
            path="product/commentoneproduct/:id"
            element={
              <GaurdRoute requiredPermission="product.view">
                <ComponentTableComment />
              </GaurdRoute>
            }
          />

          <Route
            path="roles"
            element={
              <GaurdRoute requiredPermission="role.view">
                <RolesPage />
              </GaurdRoute>
            }
          />
          <Route
            path="customrole"
            element={
              <GaurdRoute requiredPermission="role.create">
                <CreatCustomRolePage />
              </GaurdRoute>
            }
          />
          <Route
            path="customrole/description"
            element={
              <GaurdRoute requiredPermission="role.view">
                <DescriptionRolePage />
              </GaurdRoute>
            }
          />

          <Route
            path="Comment"
            element={
              <GaurdRoute requiredPermission="comment.view">
                <ComponentTableComment />
              </GaurdRoute>
            }
          />

          <Route path="logout" element={<LogoutPage />} />
          <Route path="Profile" element={<Profile />} />
          <Route
            path="Profile/updateUser"
            element={<ComponentFormUpdateUser />}
          />
          <Route
            path="Profile/updatePassword"
            element={<ComponnetUpdetePassword />}
          />
        </Route>

        {/* ------- 403 & 404 ------- */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
