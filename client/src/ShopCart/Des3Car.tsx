import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
const Des3Car = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();

  const findProduct = allProduct.find((pro) => pro.slug === slug);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
        <h2 className="text-2xl font-bold text-blue-800 border-r-4 border-blue-600 pr-3 mb-4">
          درباره ی ماشین
        </h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {findProduct?.description}
        </p>
        <div className="text-gray-600 mb-3 ">
          <span>قیمت روزانه :</span>
          <span className="bg-blue-100 p-0.5 rounded ">
            {findProduct?.price_per_day} تومان
          </span>
        </div>
        <div className="text-gray-600 mb-3  ">
          <span>کمپانی :</span>

          <span className=" border-blue-400 border-b-3 px-1.5 py-0.5  ">
            {findProduct?.company}
          </span>
        </div>
        <div className="text-gray-600 mb-3  ">
          <span>تگ ها :</span>
          <span className=" border-blue-400 border-b-3 px-1.5 py-0.5  ">
            {findProduct?.tags.join(" ,")}
          </span>
        </div>
        <div className="text-gray-600 mb-3  ">
          <span>دسته بندی:</span>
          <span className="  border-blue-400 border-b-3 px-1.5 py-0.5  ">
            {findProduct?.category.name}
          </span>
        </div>
        <div className="text-gray-600 mb-3  ">
          <span>تاریخ ایجاد پست:</span>
          <span className="  border-blue-400 border-b-3 px-1.5 py-0.5  ">
            {new Date(findProduct?.created_at ?? new Date()).toLocaleDateString(
              "fa-IR",
            )}
          </span>
        </div>
        <div className="text-gray-600 mb-3  ">
          <span>تاریخ اخرین پست:</span>
          <span className="  border-blue-400 border-b-3 px-1.5 py-0.5  ">
            {new Date(findProduct?.created_at ?? new Date()).toLocaleDateString(
              "fa-IR",
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default Des3Car;
