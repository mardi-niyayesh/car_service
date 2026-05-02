//components
import ComponentDatailUser from "../Components/ComponentDatailUser";
//
import { Link } from "react-router-dom";

const DetalisUserPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        <div className="mb-4">
          <Link to="/panel/users">
            <span className="hover:text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
              کاربران/
            </span>
          </Link>

          <span className="hover:text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
            جزعیات کابران
          </span>
        </div>
        <div className="flex flex-col gap-4 ">
          <ComponentDatailUser />
        </div>
      </div>
    </div>
  );
};

export default DetalisUserPage;
