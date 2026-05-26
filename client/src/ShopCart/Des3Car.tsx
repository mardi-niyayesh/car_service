import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
const Des3Car = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();

  const findProduct = allProduct.find((pro) => pro.slug === slug);
  return (
    <>
      {findProduct?.description && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
          <h2 className="text-2xl font-bold text-blue-800 border-r-4 border-blue-600 pr-3 mb-4">
            درباره ی ماشین
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {findProduct?.description}
          </p>
        </div>
      )}
    </>
  );
};

export default Des3Car;
