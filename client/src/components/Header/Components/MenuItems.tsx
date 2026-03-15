import { Link } from "react-router-dom";

interface MenuItemsProps {
  onClick?: () => void;
  isMobile?: boolean;
}

const menuItems = [
  { label: "خانه", path: "/", isButton: false },
  { label: "رزرو خودرو", path:null , isButton: true },
  { label: "خدمات ما", path: null, isButton: true },
  { label: "بلاگ", path: "/panel", isButton: false },
  { label: "درباره ما", path: "/about", isButton: false },
  { label: "تماس با ما", path: "/contact", isButton: false },
];

const MenuItems = ({ onClick, isMobile = false }: MenuItemsProps) => {
  const baseClass = isMobile
    ? "w-full block text-right text-[#353535] font-medium text-[18px] py-3 px-4 rounded-lg hover:bg-white/50 hover:text-[#194BF0] transition-all duration-200"
    : "hover:text-[#194BF0] transition-colors";

  return (
    <>
      {menuItems.map((item, index) => (
        <li key={index}>
          {item.isButton ? (
            <button onClick={onClick} className={baseClass}>
              {item.label}
            </button>
          ) : (
            <Link to={item.path!} onClick={onClick} className={baseClass}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </>
  );
};

export default MenuItems;