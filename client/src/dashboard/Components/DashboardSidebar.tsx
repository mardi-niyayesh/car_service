import wallet from "../../../assets/empty-wallet.png";
import ArrowLeft from "../../../assets/Arrowleft.png";
import card from "../../../assets/card-pos.png";
import reserv from "../../../assets/reserve.png";
import comment from "../../../assets/comment.png";
import logout from "../../../assets/logout.png";
import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";


const Menu = [
  { to: "/", label: "خانه", icon: <HiOutlineHome size={20}  style={{ opacity: 0.5 }}/> },
  { to: "/dashboard/wallet", label: "کیف پول", icon: wallet },
  { to: "reserve", label: "رزروها", icon: reserv },
  { to: "card", label: "پرداخت", icon: card },
  { to: "comment", label: "نظرات", icon: comment },
];
const DashboardSidebar = () => {
  return (
    <>
      <div>
        {/* Desktop and tablet* */}

        <div
          className="hidden md:flex fixed top-0 right-0 h-full w-72 bg-[#F6F6F6]
        border-2 border-gray-300 flex-col items-start p-4 overflow-y-auto shadow-sm z-40"
        >
          <div className="flex m-auto">
            <span className="text-[18px] md:text-[22px] lg:text-[35px] font-bold text-[#194BF0]">
              اُتــو
            </span>
            <span className="text-[18px] md:text-[22px] lg:text-[35px] font-bold text-[#FDB713]">
              رِنت
            </span>
          </div>

          <MenuItems />
        </div>

        {/* Mobile */}
        <div
          className="md:hidden fixed bottom-0 right-0 left-0 bg-[#EDEDED] border-t border-gray-200
        flex justify-around items-center p-2 z-50 shadow-inner"
        >
          {Menu.map((item) => (
            <Link key={item.to} to={item.to}>
              <div className="flex flex-col items-center text-gray-600 hover:text-gray-900">
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-5 h-5 mb-1"
                  />
                ) : (
                  item.icon
                )}
                <p className="text-[11px] font-medium">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
//component
const MenuItems = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Menu.map((item) => (
        <Link key={item.to} to={item.to}>
          <div className="flex justify-between items-center p-3 bg-[#EDEDED] rounded-xl hover:bg-gray-500 hover:text-white transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-3">
              {typeof item.icon === "string" ? (
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
              ) : (
                item.icon
              )}
              <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white">
                {item.label}
              </p>
            </div>
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-4 h-4 md:w-5 :h-5 opacity-60 group-hover:invert transition-all duration-300"
            />
          </div>
        </Link>
      ))}

      <Link to="logout">
        <div className="flex items-center gap-3 p-3 bg-[#EDEDED] rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer group">
          <img
            src={logout}
            alt="logout"
            className="w-5 h-5 md:w-6 md:h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300"
          />
          <p className="text-[12px] md:text-[13px] font-medium text-[#494949] group-hover:text-white">
            خروج
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;
