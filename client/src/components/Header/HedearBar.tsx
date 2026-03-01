//hooks
import { useLocation } from "react-router-dom";
import { useState } from "react";
//components
import Logo from "./Components/Logo";
import DesktopMenu from "./Components/DesktopMenu";
import MobileMenu from "./Components/MobileMenu";
import SearchButton from "./Components/SearchButton";

const HeaderBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "صفحه اصلی";
      case "/about":
        return "درباره ما";
      case "/contact":
        return "تماس با ما";
      case "/roles":
        return "قوانین و مقررات";
      case "/questionPage":
        return "سوالات متدوال";
      case "/register":
        return " ثبت نام";
      case "/login":
        return "  ورود";
           case "/forgot-password":
        return " فراموشی رمز عبور";
      default:
        return "اتورنت";
    }
  };

  return (
    <>
      <div className="bg-[#194BF0] text-[#FFFFFF] text-[24px] md:text-[40px] lg:text-[56px] items-center text-center justify-center py-3">
        {getPageTitle()}
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <div className="container w-full max-w-[1200px] mx-auto px-4 relative">
        <div className="flex items-center justify-between bg-[#FFFFFF] py-4">
          <Logo />

          <DesktopMenu closeMenu={closeMenu} />

          <div className="flex lg:hidden items-center gap-4">
            <SearchButton isMobile />
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="منو"
            >
              <span
                className={`bg-[#194BF0] h-1 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`bg-[#194BF0] h-1 w-6 rounded-full my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`bg-[#194BF0] h-1 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </>
  );
};

export default HeaderBar;
