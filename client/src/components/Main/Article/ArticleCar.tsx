import ComponentArticleCar from "./ComponentArticleCar";
import { FaArrowLeft } from "react-icons/fa";

const ArticleCar = () => {
  return (
    <>
      <div className="mt-8 mb-8 container mx-auto flex items-center justify-between">
        <div className="font-bold text-blue-800 text-2xl  my-5">
          مقالات کار سرویس
        </div>
        <p className="text-gray-600 hover:text-blue-600 cursor-pointer flex items-center justify-between gap-2">
          مشاهده همه <FaArrowLeft size={20} opacity={0.8} />
        </p>
      </div>
      <ComponentArticleCar />
    </>
  );
};

export default ArticleCar;
