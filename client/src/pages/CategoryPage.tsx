import ComponentTableCategory from "../components/PanelAdmin/CategoryForm/ComponentTableCategory";
import { useUser } from "../hooks/useUser";
import { Link } from "react-router-dom";
const CategoryPage = () => {
  const { hasPermission, hasRole } = useUser();
  const hasCreatPermession =
    hasPermission("category.creat") || hasRole("category_manager");

  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row mb-10 items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
            <p className="text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
              دسته بندی
            </p>
          </div>
          {hasCreatPermession && (
            <Link to="/panel/category/CreatCategory">
              <p className="text-[#194BF0] hover:bg-blue-200 bg-blue-100 p-2 rounded-xl sm:text-[18px] md:text-[18px] font-medium whitespace-nowrap">
                + ساختن دسته بندی جدید
              </p>
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-4 ">
          <ComponentTableCategory />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
