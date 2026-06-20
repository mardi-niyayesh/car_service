import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
const Des4Car = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();

  const findProduct = allProduct.find((pro) => pro.slug === slug);
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-2 ">
      <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-wrap   items-center justify-center gap-2.5">
          <h1 className="text-gray-700 font-bold  mb-4">
            {findProduct?.name}
          </h1>
          <div className="flex ">
            {Array.from({ length: findProduct?.rate }, (_, index) => (
              <FaStar key={index} color="gold" size={18} />
            ))}
          </div>
        </div>
        <img
          src={`/${findProduct?.image}`}
          alt={findProduct?.name}
          className="w-full md:w-64 h-36 object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Des4Car;
