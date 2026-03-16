//hooks
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../../hooks/useUser";
//types
import { type AuthButtonsProps } from "../../../types/auth.types";
//img
import imglogin from "../../../../assets/login.png";
import arrow from "../../../../assets/Arrowleft.png";


const AuthButtons = ({ isMobile = false, onClose }: AuthButtonsProps) => {
  const [showLoginMenue, setShowLoginMenue] = useState(false);

  const { user, logout } = useUser();

  const handleButtonClick = () => {
    setShowLoginMenue(!showLoginMenue);
  };

  const desktopButton = (
    <div className="relative hidden lg:block">
      <button
        onClick={handleButtonClick}
        className="bg-[#194BF0] rounded-xl px-2 py-2 text-white font-medium hover:bg-[#1539c0] "
      >
        {user ? (
          <div className="flex justify-between items-center p-1.5 md:p-3  rounded-lg cursor-pointer ">
            <span className="flex items-center">
              {user.display_name ? <>{user.display_name}</> : "profile User"}
            </span>
            <img
              src={arrow}
              alt="wallet"
              className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </div>
        ) : (
          "ورود | ثبت‌نام"
        )}
      </button>
      {showLoginMenue && (
        <div className="absolute top-full left-0 mt-2 z-50 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border-b-2 border-b-theme-color-dark overflow-hidden">
          {user ? (
            <>
              <Link to="/dashboard">
                <div className="p-3 bg-gray-300 text-black  cursor-pointer hover:bg-gray-500 flex items-center gap-3 group:">
                  <img src={imglogin} alt="" className="w-5 h-5 opacity-70" />
                  <p> داشبورد</p>
                </div>
              </Link>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div
                className="p-3 bg-gray-300 text-black  cursor-pointer flex items-center gap-3  hover:bg-gray-500"
                onClick={() => {
                  logout();
                }}
              >
                <img src={imglogin} alt="" className="w-5 h-5 opacity-70 " />
                <p> خروج</p>
              </div>
            </>
          ) : (
            <LoginMenuItems />
          )}
        </div>
      )}
    </div>
  );

  const mobileButton = (
    <div className="relative mt-8">
      <button
        onClick={handleButtonClick}
        className={`w-full rounded-xl py-3 font-medium shadow-lg flex items-center justify-center gap-2 transition-colors ${
          user
            ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            : "bg-[#194BF0] text-[#FFFFFF] hover:bg-[#1539c0]"
        }`}
      >
        {user ? (
          <div className="flex justify-between items-center p-1.5 md:p-3  rounded-lg cursor-pointer ">
            <span className="flex items-center">
              {user.display_name ? <>{user.display_name}</> : "profile User"}
            </span>
            <img
              src={arrow}
              alt="wallet"
              className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </div>
        ) : (
          <>
            <span>ورود| ثبت‌نام</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${showLoginMenue ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>
      {showLoginMenue && (
        <div className="mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {user ? (
            <>
              <Link to="/dashboard">
                <div className="p-3 bg-gray-300 text-black  cursor-pointer hover:bg-gray-500 flex items-center gap-3 group:">
                  <img src={imglogin} alt="" className="w-5 h-5 opacity-70" />
                  <p> داشبورد</p>
                </div>
              </Link>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div
                className="p-3 bg-gray-300 text-black  cursor-pointer flex items-center gap-3  hover:bg-gray-500"
                onClick={() => {
                  logout();
                }}
              >
                <img src={imglogin} alt="" className="w-5 h-5 opacity-70 " />
                <p> خروج</p>
              </div>
            </>
          ) : (
            <LoginMenuItems />
          )}
        </div>
      )}
    </div>
  );

  return isMobile ? mobileButton : desktopButton;
};

const LoginMenuItems = ({
  setShowLoginMenue,
  onClose,
  isMobile = false,
}: any) => {
  const handleClick = () => {
    setShowLoginMenue(false);
    onClose?.();
  };

  const itemClass = isMobile
    ? "flex items-center gap-3 px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    : "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200";

  const { user } = useUser();

  return (
    <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
      {!user && (
        <>
          <li>
            <Link to="/login" onClick={handleClick} className={itemClass}>
              <img src={imglogin} alt="" className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium">ورود</span>
            </Link>
          </li>
          <li>
            <Link to="/register" onClick={handleClick} className={itemClass}>
              <img src={imglogin} alt="" className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium">ثبت‌نام</span>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default AuthButtons;
