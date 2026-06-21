import ShowCategoryForm from "../ShowCategoryForm";
import { FaCar } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import AllProductMain from "./AllProductMain";

const ShowProductMain = () => {
  return (
    <>
      <div className="text-2xl font-bold items-center flex mt-5 mb-5 justify-center ">
        <span className="text-[#FDB713]">رزو خودرو در کارسرویس</span>

        <FaCar size={25} opacity={0.7} className="mr-2" />
      </div>

      <ShowCategoryForm />
      <div className="flex  justify-end container max-auto">
        <div className="mt-10 ">
          <Link
            to="/reservcar"
            className="flex items-center justify-end gap-2 hover:text-yellow-600 text-[#FDB713] font-semibold  "
          >
            <span> مشاهده ی همه </span>
            <FiArrowLeft className="text-lg" />
          </Link>
        </div>
      </div>
      <AllProductMain />
    </>
  );
};

export default ShowProductMain;
