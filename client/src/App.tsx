//components
import { Routes, Route } from "react-router-dom";
import HeaderSite from "./components/Header/HeaderSite";
import Footer from "./components/Footer/Footer";
import ComponentsPanelAdmin from "./PanelAdmin/Components/ComponentsPanelAdmin";
import DashboardLayout from "./dashboard/Components/DashboardLayout";

//pages
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import RolsPage from "./pages/RolsPage";
import QuestionPage from "./pages/QuestionPage";
import NotFoundPage from "./pages/NotFoundPage";
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
//pages for panelAdmin
import UsersPage from "./PanelAdmin/Pages/UsersPage";
import DetalisUserPage from "./PanelAdmin/Pages/DetalisUserPage";
import ProductPage from "./PanelAdmin/Pages/ProductPage";
import CategoryPage from "./PanelAdmin/Pages/CategoryPage";
function App() {
  return (
    <>
      <HeaderSite />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/roles" element={<RolsPage />} />
        <Route path="/questionPage" element={<QuestionPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Route for panelUser */}
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/dashboard/address" element={<AddressPages />} />
        <Route path="/dashboard/comment" element={<CommentPages />} />
        <Route path="/dashboard/reserve" element={<ReservePages />} />
        <Route path="/dashboard/wallet" element={<WalletPages />} />
        <Route path="/dashboard/card" element={<CardPages />} />
        <Route path="/dashboard/logout" element={<LogoutPage />} />
        {/* Route for panelAdmin */}
        <Route path="/panel" element={<ComponentsPanelAdmin />} />
        <Route path="/panel/users" element={<UsersPage />} />
        <Route path="/panel/users/detail" element={<DetalisUserPage />} />
         <Route path="/panel/product" element={<ProductPage />} />
         <Route path="/panel/category" element={<CategoryPage />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
