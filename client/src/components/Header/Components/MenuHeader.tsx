import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaInfoCircle,
  FaBlog,
  FaHandsHelping,
  FaRegCalendarAlt,
  FaHome,
} from "react-icons/fa";

const menuItems = [
  { label: "خانه ", path: "/", icon: <FaHome size={20} /> },
  {
    label: "رزرو ",
    icon: <FaRegCalendarAlt size={20} />,
    dropdownItems: [
      { label: "انتخاب شهر...", value: "", disabled: true },
      { label: "رزرو خودرو در مشهد", path: "/reserve/mashhad" },
      { label: "رزرو خودرو در تبریز", path: "//reserve/tabriz" },
      { label: "رزرو خودرو در شیراز", path: "/reserve/shiraz" },
      { label: "رزرو خودرو در ساری", path: "/reserve/sary" },
      { label: "رزرو خودرو در قشم", path: "/reserve/qeshm" },
      { label: "رزرو خودرو در نیشابور", path: " /reserve/nayshaboor" },
      { label: "رزرو خودرو در مشهد", path: "/reserve/mashhad" },
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

      event.target.value = "";
    }
  };
  return (
    <>
      {/* Desktop Menu  */}
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
                        <Link to="optionItem.path">
                          <option
                            key={optionItem.label}
                            value={optionItem.path}
                            disabled={optionItem.disabled || false}
                          >
                            {optionItem.label}
                          </option>
                        </Link>
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

      {/* Mobile Menu */}
      <div
        className="md:hidden fixed bottom-0 right-0 left-0 bg-[#EDEDED] border-t border-gray-200
              flex justify-around items-center p-2 z-50 shadow-inner h-16"
      >
        {menuItems.map((item) => {
          if (item.dropdownItems) {
            return (
              <div
                key={item.label}
                className="relative flex flex-col items-center justify-center group w-1/5 text-center"
              >
                <div className="flex flex-col items-center justify-center text-gray-700 group-hover:text-blue-600 transition duration-300 ease-in-out">
                  {item.icon && (
                    <span className="text-xl mb-1">{item.icon}</span>
                  )}
                  <span className="text-xs font-medium">{item.label}</span>
                </div>

                <select
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none bg-transparent"
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
              </div>
            );
          } else {
            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out w-1/5" // w-1/5 برای توزیع عرض
                onClick={() => item.path && navigate(item.path)}
              >
                {item.icon && <span className="text-xl mb-1">{item.icon}</span>}
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default MenuHeader;
