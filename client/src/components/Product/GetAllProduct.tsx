import { useProduct } from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiBookmark } from "react-icons/fi";
const GetAllProduct = () => {
  const { allProduct, loading } = useProduct();
  console.log(allProduct);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="mr-2 text-gray-600">بارگذاری محصولات ...</span>
      </div>
    );
  }

  if (!allProduct.length) {
    return (
      <div className="text-center text-gray-500 py-8">هیچ محصولی یافت نشد</div>
    );
  }

  const handleClickBtn = (slug: string) => {
    navigate(`/detailcar/${slug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  container mx-auto ">
      {allProduct.map((product) => (
        <div
          key={product.id}
          className="max-w-[350px] border-2 border-[#D7D7D7] p-4 mt-10 rounded-2xl"
        >
          <img src={`/${product.image}`} alt={product.name} />
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[16px] text-[#0C0C0C] mb-2">
              {product.name}
            </h2>
            <div className="flex gap-1">
              <AiOutlineHeart color="red" size={18} />
              <FiBookmark size={18} />
            </div>
          </div>

          <div className="text-[#5a5656] text-[15px] mb-2">
            <span>کمپانی:</span>
            <span>{product.company}</span>
          </div>
          <div className="flex items-center justify-between mb-2 bg-gray-200 rounded border-r-3 border-blue-400 p-1">
            <div className="flex items-center justify-center">
              <span className="text-[#212121] text-[12px]">هزینه :</span>
              <span className="text-[#05164D] text-[16px] font-bold">
                {product.price_per_day}
              </span>
            </div>
            <p className="text-[#212121] text-[12px]">روزانه</p>
          </div>
          <div className="text-gray-500 font-bold text-[12px] mb-2">
            <span>قابل اجاره هست؟</span>
            <span>{product.can_rent ? "بله" : "خیر"}</span>
          </div>
          <div className="flex justify-between items-center text-[15px] mb-2 mt-2">
            <p>امتیاز :</p>
            <div className="flex ">
              {Array.from({ length: product.rate }, (_, index) => (
                <FaStar key={index} color="gold" size={15} />
              ))}
            </div>
          </div>
          <p className="text-[#212121] font-bold text-[12px] mb-2">
            {product.description}
          </p>

          <button
            className="bg-[#194BF0] text-[#FFFFFF] w-full px-4 py-2 rounded-2xl hover:bg-blue-800 cursor-pointer"
            onClick={() => handleClickBtn(product.slug)}
          >
            درخواست رزرو
          </button>
        </div>
      ))}
    </div>
  );
};
export default GetAllProduct;
