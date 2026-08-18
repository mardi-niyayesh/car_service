
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import ComponentDatailUser from "../components/PanelAdmin/UserForm/ComponentDatailUser";

const DetalisUserPage = () => {
  return (
    <div className="min-h-screen  p-3 sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">

        <div
          className="
            mb-5
            flex
            flex-wrap
            items-center
            gap-2
            px-4
            py-3
            sm:px-5
            sm:py-4
          "
        >
        
          <Link
            to="/panel/users"
            className="
              group
              flex
              items-center
              gap-1.5
              text-sm
              font-bold
              text-[#c58b00]
              transition-colors
              duration-200
              sm:text-base
            "
          >
            <span>کاربران</span>

            <FaAngleLeft
              size={14}
              className="
                transition-transform
                duration-200
                group-hover:-translate-x-1
              "
            />
          </Link>
          <span
            className="
              text-sm
              font-semibold
              text-gray-700
              sm:text-base
            "
          >
            جزئیات کاربر
          </span>
        </div>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <ComponentDatailUser />
        </div>
      </div>
    </div>
  );
};

export default DetalisUserPage;

