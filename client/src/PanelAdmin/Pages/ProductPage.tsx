//components
import ComponentCategoryProduct from "../Components/ComponentCategoryProduct";
import ComponentTableProduct from "../Components/ComponentTableProduct";
import ComponentFormAddProduct from "../Components/ComponentFormAddProduct";
const ProductPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        {/* header product*/}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
          <p className="text-[#4b33b5] text-[20px]  sm:text-[20px] md:text-[20px] font-bold">
            محصولات
          </p>
        </div>
        {/*Components CategoryProduct  */}
        <div className="flex flex-col gap-4 ">
          <ComponentCategoryProduct />
        </div>
        {/*Components TableProduct */}
        <div dir="rtl" className="p-4">
          <ComponentTableProduct />
        </div>
        {/*Components FormAddProduct */}
        <div className="flex flex-col gap-4 ">
          <ComponentFormAddProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
