import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import Des1Car from "./Des1Car";
import Des2Car from "./Des2Car";
import Des3Car from "./Des3Car";
import Des4Car from "./Des4Car";
import Comment from "../Commens/Comment";

import HeroBaner from "../components/Main/HeroBaner";

const DetailCar = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();

  const findProduct = allProduct.find((pro) => pro.slug === slug);

  if (!findProduct) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-bold">
        محصولی یافت نشد
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="flex flex-col md:flex-row gap-6 md:justify-between">
          <div className="md:w-1/2 w-full  ">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <Des4Car />
              <Des2Car />
              <Des1Car />
            </div>
            {findProduct.description && (
              <div className="mt-2">
                <Des3Car />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <HeroBaner />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5  md:w-1/2 mt-4">
          <h2 className="text-2xl font-bold text-blue-800 border-r-4 border-blue-600 pr-3 mb-4">
            نظرات
          </h2>
          <Comment />
        </div>
      </div>
    </>
  );
};

export default DetailCar;
