import { Link } from "react-router-dom";
import ArrowLeft from "../../../assets/Arrowleft.png";
import { FaUser } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";
import { useUser } from "../../hooks/useUser";

const Menu = [
  {
    to: "users",
    label: "کاربران",
    icon: <FaUser style={{ opacity: 0.6 }} />,
    permission: "user.view",
    role: "user_manager",
  },
  {
    to: "roles",
    label: "نقش‌ها",
    icon: <FiFilePlus style={{ opacity: 0.6 }} />,
    permission: "role.view",
    role: "role_manager",
  },
  {
    to: "customrole",
    label: "نقش سفارشی",
    icon: <FiFilePlus style={{ opacity: 0.6 }} />,
    permission: "role.create",
    role: "role_manager",
  },
  {
    to: "category",
    label: "دسته‌بندی",
    icon: <FaListUl style={{ opacity: 0.6 }} />,
    permission: "category.update",
    role: "category_manager",
  },
  {
    to: "product",
    label: "محصولات",
    icon: <FaBoxOpen style={{ opacity: 0.6 }} />,
    permission: "product.update",
    role: "product_manager",
  },
];

const ComponentsPanelAdmin = () => {
  const { hasPermission, hasRole } = useUser();

  const canUserSeeItem = (item: (typeof Menu)[0]) => {
    if (hasRole("owner")) return true;

    let hasRequiredPermission = true;
    if (item.permission) {
      hasRequiredPermission = hasPermission(item.permission);
    }

    let hasRequiredRole = true;
    if (item.role) {
      hasRequiredRole = hasRole(item.role);
    }

    if (item.permission && item.role) {
      return hasRequiredPermission || hasRequiredRole;
    } else if (item.permission) {
      return hasRequiredPermission;
    } else if (item.role) {
      return hasRequiredRole;
    }

    return true;
  };

  const filteredMenu = Menu.filter((item) => canUserSeeItem(item));

  return (
    <>
      <div>
        {/* Desktop and tablet */}
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

          <MenuItems items={filteredMenu} />
        </div>

        {/* Mobile */}
        <div
          className="md:hidden fixed bottom-0 right-0 left-0 bg-[#EDEDED] border-t border-gray-200
          flex justify-around items-center p-2 z-50 shadow-inner"
        >
          {filteredMenu.map((item) => (
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

const MenuItems = ({ items }: { items: typeof Menu }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item) => (
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
    </div>
  );
};

export default ComponentsPanelAdmin;
