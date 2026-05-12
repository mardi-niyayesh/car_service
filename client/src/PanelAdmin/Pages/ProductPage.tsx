import ComponentTableProduct from "../../components/PanelAdmin/ProductForm/ComponentTableProduct";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
const ProductPage = () => {
  const { hasPermission, hasRole } = useUser();
  const hasCreatProductPerm =
    hasPermission("product.create") || hasRole("product_manager");
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1 ">
        <div className="flex flex-col sm:flex-row mb-10 items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
            <p className="text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
              محصولات
            </p>
          </div>
          {hasCreatProductPerm && (
            <Link to="/panel/product/creatproduct">
              <p className="text-[#194BF0] hover:bg-blue-200 bg-blue-100 p-2 rounded-xl text-[14px] md:text-[16px] font-medium whitespace-nowrap">
                + ایجاد محصول جدید
              </p>
            </Link>
          )}
        </div>

        <div dir="rtl" className="p-4">
          <ComponentTableProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
