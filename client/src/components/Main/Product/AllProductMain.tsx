import ShowCategoryForm from "../ShowCategoryForm";
import { FaCar } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

import GetAllProduct from "../../Product/GetAllProduct";
const AllProductMain = () => {
  return (
    <>
      <div className="text-2xl font-bold items-center flex  justify-center">
        <span>رزو خودرو در</span>
        <span className="text-yellow-500">اتورنت</span>
        <FaCar size={25} opacity={0.7} className="mr-2" />
      </div>

      <ShowCategoryForm />
      <div className="flex  justify-end container max-auto">
        <div className="mt-10 ">
          <Link
            to="/"
            className="flex items-center justify-end gap-2 text-blue-500 hover:text-blue-700 font-semibold  "
          >
            <span> مشاهده ی همه </span>
            <FiArrowLeft className="text-lg" />
          </Link>
        </div>
      </div>
      <GetAllProduct />
    </>
  );
};

export default AllProductMain;
