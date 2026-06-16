import { useLocation } from "react-router-dom";
import profilUser from "../../../assets/imges/Ellipse 114.png";
import logout from "../../../assets/imges/logout.png";
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
    <div>
      <header className="flex justify-between items-center w-full px-6 py-4 bg-white border-b border-gray-300 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img
            src={profilUser}
            alt="profilUser"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="font-bold text-[16px] text-[#353535] max-w-[200px]">
              {user?.display_name || "کاربر "}
            </p>
            <p className="text-[#727272] font-medium text-[13px] max-w-[200px]">
              {user?.email || "example@email.com"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Link to="logout">
            <img
              src={logout}
              alt="logout"
              className="w-5 h-5 md:w-6 md:h-5 group-hover:brightness-0 group-hover:invert transition-all duration-300"
            />
          </Link>
          <Link to="Profile">
            <FaUser style={{ opacity: 0.5, cursor: "pointer" }} size={18} />
          </Link>
          <Link to="/">
            <HiOutlineHome size={22} style={{ opacity: 0.6 }} />
          </Link>
        </div>
      </header>

      {(isMainDashboard || isMainPanel) && <Profile />}
    </div>
  );
};

export default HeaderDashbord;
