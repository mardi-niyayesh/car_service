import { useLocation } from "react-router-dom";
import profilUser from "../../../assets/imges/Ellipse 114.png";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "../../hooks/useUser";
import { FaUser } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import Profile from "../../pages/Profile";

const HeaderDashbord = () => {
  const { user } = useUser();
  const location = useLocation();

  const isMainDashboard = location.pathname === "/dashboard";
  const isMainPanel = location.pathname === "/panel";

  return (
    <div className="w-full">
      <header
        className="
          sticky
          top-0
          z-40
          w-full
          border-b
          border-gray-100
          bg-white/95
          backdrop-blur-md
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1600px]
            items-center
            justify-between
            gap-4
            px-4
            py-3
            sm:px-6
            sm:py-4
            lg:px-8
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={profilUser}
                alt="پروفایل کاربر"
                className="
                  h-10
                  w-10
                  rounded-full
                  border-2
                  border-white
                  object-cover
                  shadow-sm
                  sm:h-12
                  sm:w-12
                "
              />

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  border-white
                  bg-green-500
                  sm:h-3
                  sm:w-3
                "
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  max-w-[150px]
                  truncate
                  text-sm
                  font-bold
                  text-gray-800
                  sm:max-w-[220px]
                  sm:text-base
                "
              >
                {user?.display_name || "کاربر"}
              </p>

              <p
                className="
                  mt-0.5
                  max-w-[150px]
                  truncate
                  text-[11px]
                  font-medium
                  text-gray-400
                  sm:max-w-[220px]
                  sm:text-xs
                "
              >
                {user?.email || "example@email.com"}
              </p>
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-1.5 ">
            <Link
              to="logout"
              aria-label="خروج"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
              
                transition-all
                duration-200
              border-red-100
                bg-red-50
                active:scale-95
                sm:h-10
                sm:w-10
              "
            >
              <FiLogOut
                className="
                  h-4
                  w-4
                  opacity-60
                  transition-all
                  duration-200
                  group-hover:opacity-100
                  sm:h-5
                  sm:w-5
                "
              />
            </Link>

            <Link
              to="Profile"
              aria-label="پروفایل"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                text-gray-500
                transition-all
                duration-200
              border-[#FDB713]/30
                bg-[#FDB713]/10
                hover:text-[#c58b00]
                  active:scale-90
                  active:bg-[#FDB713]/30
                 active:text-[#c58b00]
                sm:h-10
                sm:w-10
              "
            >
              <FaUser
                size={15}
                className="
                  opacity-60
                  transition-opacity
                  duration-200
                  group-hover:opacity-100
                  sm:text-base
                "
              />
            </Link>

            <Link
              to="/"
              aria-label="صفحه اصلی"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
               
                text-gray-500
                transition-all
                duration-200
              border-[#FDB713]/30
              bg-[#FDB713]/10
                hover:text-[#c58b00]
                   active:scale-90
                  active:bg-[#FDB713]/30
                 active:text-[#c58b00]
                
                sm:h-10
                sm:w-10
              "
            >
              <HiOutlineHome
                size={19}
                className="
                  opacity-60
                  transition-opacity
                  duration-200
                  group-hover:opacity-100
                "
              />
            </Link>
          </nav>
        </div>
      </header>

      {(isMainDashboard || isMainPanel) && <Profile />}
    </div>
  );
};

export default HeaderDashbord;
