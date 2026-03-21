import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaInfoCircle,
  FaBlog,
  FaHandsHelping,
  FaHome,
} from "react-icons/fa";

const menuItems = [
  { label: "خانه ", path: "/", icon: <FaHome size={20} /> },
  {
    label: "رزرو خودرو",
    dropdownItems: [
      { label: "انتخاب شهر...", value: "", disabled: true },
      { label: "رزرو خودرو در مشهد", path: "/car-booking/mashhad" },
      { label: "رزرو خودرو در تهران", path: "/car-booking/tehran" },
      { label: "رزرو خودرو در اصفهان", path: "/car-booking/isfahan" },
      { label: "رزرو خودرو در ساری", path: "/car-booking/isfahan" },
      { label: "رزرو خودرو در قشم", path: "/car-booking/isfahan" },
    ],
  },
  { label: "خدمات ما", path: "/services", icon: <FaHandsHelping size={20} /> },
  { label: "بلاگ", path: "/blog", icon: <FaBlog size={20} /> },
  { label: "درباره ما", path: "/about", icon: <FaInfoCircle size={20} /> },
  { label: "تماس با ما", path: "/contact", icon: <FaPhone size={20} /> },
];

const MenuHeader = () => {
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedPath = event.target.value;
    if (selectedPath) {
      navigate(selectedPath);
    }
  };
  return (
    <>
      <div className="bg-white py-4 ">
        <nav className=" hidden md:flex container mx-auto px-4 flexed items-center justify-between">
          <ul className="flex items-center space-x-6 ">
            {menuItems.map((item) => {
              if (item.dropdownItems) {
                return (
                  <li
                    key={item.label}
                    className="relative  flex items-center group"
                  >
                    <div className="flex items-center px-3 py-2 text-gray-700 ">
                      <span className="font-medium">{item.label}</span>
                    </div>

                    <select
                      className="absolute inset-0 w-full h-full opacity-0 p- cursor-pointer bg-transparent appearance-none"
                      onChange={handleSelectChange}
                      value=""
                    >
                      {item.dropdownItems.map((optionItem) => (
                        <option
                          key={optionItem.label}
                          value={optionItem.path}
                          disabled={optionItem.disabled || false}
                        >
                          {optionItem.label}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              } else {
                return (
                  <li
                    key={item.path}
                    className="text-gray-500 flex items-center"
                  >
                    <Link
                      to={item.path}
                      className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out px-3 py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile */}
      <div
        className="md:hidden fixed bottom-0 right-0 left-0 bg-[#EDEDED] border-t border-gray-200
              flex justify-around items-center p-2 z-50 shadow-inner"
      >
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
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
    </>
  );
};

export default MenuHeader;
