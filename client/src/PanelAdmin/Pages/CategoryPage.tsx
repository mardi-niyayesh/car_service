import ComponentTableCategory from "../Components/ComponentTableCategory";
import locationadd from "../../../assets/location-add.png";
import { Link } from "react-router-dom";
const CategoryPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row mb-10 items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
            <p className="text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
              دسته بندی
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto cursor-pointer bg-blue-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <img
              src={locationadd}
              alt="locationadd"
              className="w-4 h-4 md:w-5 md:h-5"
            />
            <Link to="/panel/category/CreatCategory">
              <p className="text-[#194BF0] text-[14px] md:text-[16px] font-medium whitespace-nowrap">
                اضافه کردن دسته بندی
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <ComponentTableCategory />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
