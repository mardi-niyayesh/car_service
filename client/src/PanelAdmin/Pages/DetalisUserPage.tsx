//components
import ComponentCategoryDatailUser from "../Components/ComponentUsersDatailUser";
//icon or logo
import ArrowLeft from "../../../assets/Arrowleft.png";
//
import { Link } from "react-router-dom";

const DetalisUserPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        {/* header User*/}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
          <p className="text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
            جزعیات کاربر
          </p>
          <Link to="/panel/users">
            <img
              src={ArrowLeft}
              alt="ArrowLeft"
              className="w-10 h-10  rounded-4xl p-2  border border-gray-600"
            />
          </Link>
        </div>
        {/*Components CategoryDatailUser */}
        <div className="flex flex-col gap-4 ">
          <ComponentCategoryDatailUser />
        </div>
      </div>
    </div>
  );
};

export default DetalisUserPage;
