import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import Des1Car from "./Des1Car";
import Des2Car from "./Des2Car";
import Des3Car from "./Des3Car";
import Comment from "../Commens/Comment";
import TotalPrice from "./TotalPrice";
import { FaStar } from "react-icons/fa";

const DetailCar = () => {
  const { allProduct } = useProduct();
  const { id } = useParams();

  const findProduct = allProduct.find((pro) => pro.id === id);

  if (!findProduct) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-bold">
        محصولی یافت نشد
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="md:w-1/2 w-full  ">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ">
            <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex  items-center justify-center gap-2.5">
                <h1 className="text-blue-700 font-bold text-2xl lg:text-3xl">
                  {findProduct.name}
                </h1>
                <div className="flex ">
                  {Array.from({ length: findProduct.rate }, (_, index) => (
                    <FaStar key={index} color="gold" size={18} />
                  ))}
                </div>
              </div>
              <img
                src={`/${findProduct.image}`}
                alt={findProduct.name}
                className="w-full md:w-64 h-36 object-cover rounded-lg shadow-md"
              />
            </div>
            <Des2Car />
          </div>
          <Des1Car />
        </div>
        {findProduct.description && (
          <div className="mt-2">
            <Des3Car />
          </div>
        )}
      </div>

      <div className="flex">
        <div className="mt-10 flex justify-end">
          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>انتقال به رزرو بعدی</span>
            <FiArrowLeft className="text-lg" />
          </Link>
        </div>
        <TotalPrice />
      </div>
      <Comment />
    </div>
  );
};

export default DetailCar;
