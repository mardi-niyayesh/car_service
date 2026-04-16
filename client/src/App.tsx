//context
import UserProvider from "./Context/UserProvider";
//hooks
import { Routes, Route } from "react-router-dom";
//layout components
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./dashboard/Components/DashboardLayout";
import PanelAdminLayout from "./PanelAdmin/Components/PanelAdminLayout";
//public pages
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
import ProductDetailsPage from "./components/ReserveCar.tsx/Pages/ProductDetailsPage";
//authorization pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
//pages for panelUser
import AddressPages from "./dashboard/Pages/AddressPages";
import CommentPages from "./dashboard/Pages/CommentPages";
import ReservePages from "./dashboard/Pages/ReservePages";
import WalletPages from "./dashboard/Pages/WalletPages";
import CardPages from "./dashboard/Pages/CardPages";
import LogoutPage from "./dashboard/Pages/LogoutPage";
import ComponentFormUpdateUser from "./dashboard/Components/ComponentFormUpdateUser";
import ComponnetUpdetePassword from "./dashboard/Components/ComponnetUpdetePassword";
import Profile from "./dashboard/Components/Profile";
//pages for panelAdmin
import DetalisUserPage from "./PanelAdmin/Pages/DetalisUserPage";
import ProductPage from "./PanelAdmin/Pages/ProductPage";
import CategoryPage from "./PanelAdmin/Pages/CategoryPage";
import UsersPage from "./PanelAdmin/Pages/UsersPage";
import DescriptionRole from "./PanelAdmin/Components/DescriptionRole";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          {/* ------- Public Layout ------- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/roles" element={<RolsPage />} />
            <Route path="/questionPage" element={<QuestionPage />} />
            <Route path="/reserve/qeshm" element={<ComponentQeshm />} />
            <Route path="/reserve/sary" element={<ComponentSary />} />
            <Route path="/reserve/shiraz" element={<ShirazPage />} />
            <Route path="/reserve/tabriz" element={<TabrizPage />} />
            <Route path="/reserve/mashhad" element={<MashhadPage />} />
            <Route path="/reserve/Yazd" element={<YazdPage />} />
            <Route path="/reserve/neyshaboor" element={<Nayshaboor />} />

            <Route
              path="/car-details/:carId"
              element={<ProductDetailsPage />}
            />
          </Route>

          {/* ------- Auth Layout ------- */}
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          {/* ------- Dashboard Layout ------- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="address" element={<AddressPages />} />
            <Route path="comment" element={<CommentPages />} />
            <Route path="reserve" element={<ReservePages />} />
            <Route path="wallet" element={<WalletPages />} />
            <Route path="card" element={<CardPages />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route
              path="Profile/updateUser"
              element={<ComponentFormUpdateUser />}
            />
            <Route path="Profile" element={<Profile />} />
            <Route
              path="Profile/updatePassword"
              element={<ComponnetUpdetePassword />}
            />
          </Route>
          {/* ------- Panel Admin Layout ------- */}
          <Route path="/panel" element={<PanelAdminLayout />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="users/detail/:userId" element={<DetalisUserPage />} />
            <Route
              path="users/detail/:userId/description"
              element={<DescriptionRole />}
            />
            <Route path="product" element={<ProductPage />} />
            <Route path="category" element={<CategoryPage />} />
          </Route>
          {/* ------- 404 ------- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
