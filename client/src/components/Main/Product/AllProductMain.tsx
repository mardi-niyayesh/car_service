import { useProduct } from "../../../hooks/useProduct";
import GetAllProduct from "../../Product/GetAllProduct";

import { type ProductFormType } from "../../PanelAdmin/ProductForm/ProductFormComponent";
const AllProductMain = () => {
  const { allProduct, loading } = useProduct();
  if (loading) return <div>در حال لود محصولات...</div>;
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProduct.map((pro: ProductFormType) => (
          <GetAllProduct key={pro.id} product={pro} />
        ))}
      </div>
    </>
  );
};

export default AllProductMain;
