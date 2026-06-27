import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiBookmark } from "react-icons/fi";
import { type ProductFormType } from "../PanelAdmin/ProductForm/ProductFormComponent";
import axiosClient from "../../services/axiosClient";
import { useUser } from "../../hooks/useUser";
import WarningModal from "../../Modal/WarningModal ";
import SuccessModal from "../../Modal/SuccessModal";
import ErrorModal from "../../Modal/ErrorModal";
import { useState } from "react";

type ProductProps = {
  product: ProductFormType;
};

const GetAllProduct = ({ product }: ProductProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  if (!product) {
    return (
      <div className="text-center text-gray-500 py-8">
        در این دسته بندی محصولی وجود ندارد
      </div>
    );
  }

  const handleClickBtn = (slug: string) => {
    navigate(`/detailcar/${slug}`);
  };

  const handleLikeCar = async () => {
    if (!user) {
      setIsWarningOpen(true);
      setWarningMessage("ابتدا باید وارد حساب کاربری خود شوید");
    }
    try {
      const response = await axiosClient.post(`favorites/${product.id}`);
      console.log("response for like car :", response);
      if (response.status == 201) {
        setIsSuccessOpen(true);
        setSuccessMessage("این ماشین به لیست علاقه مندی های شما اضافه شد ");
      }
      setTimeout(() => {
        navigate("dashboard/favorite_cars");
      }, 3000);
    } catch (err: any) {
      console.log("Error in like car :", err);
      if (err.response.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "ماشین مورد نظر برای لایک در دیتابیس وجود ندارد لطفا صفحه رو رفرش کنید",
        );
      } else if (err.response.status === 409) {
        setIsWarningOpen(true);
        setWarningMessage("این ماشین قبلا لایک شده است");
      } else {
        setIsErrorOpen(true);
        setErrorMessage("خطا در سرور لطفا لحظاتی بعد مجدد تلاش کنید");
      }
    }
  };

  return (
    <>
      <div>
        <div className="w-full border-2 border-[#D7D7D7] p-4 mt-10 rounded-2xl">
          <img src={`/${product.image}`} alt={product.name} />
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[18px] text-[#0C0C0C] mb-2">
              {product.name}
            </h2>
            <div className="flex gap-1">
              <AiOutlineHeart color="red" size={18} onClick={handleLikeCar} />
              <FiBookmark size={18} />
            </div>
          </div>

          <div className="text-[#5a5656] text-[18px] mb-2">
            <span>کمپانی:</span>
            <span>{product.company}</span>
          </div>
          <div className="flex items-center justify-between mb-2 bg-yellow-50 rounded border-r-3 border-yellow-300 p-1">
            <div className="flex items-center justify-center">
              <span className="text-[#212121] ">هزینه :</span>
              <span className="text-[#05164D] font-bold">
                {product.price_per_day}
              </span>
            </div>
            <p className="text-[#212121] text-[18px]">روزانه</p>
          </div>
          <div className="text-gray-500  text-[18px] mb-2">
            <span>قابل اجاره هست؟</span>
            <span>{product.can_rent ? "بله" : "خیر"}</span>
          </div>
          <div className="flex justify-between items-center text-[18px] mb-2 mt-2">
            <p>امتیاز :</p>
            <div className="flex ">
              {Array.from({ length: product.rate }, (_, index) => (
                <FaStar key={index} color="gold" size={15} />
              ))}
            </div>
          </div>
          <p className="text-[#212121]  text-[18px] mb-2">
            {product.description}
          </p>

          <button
            className="bg-yellow-500 text-[#FFFFFF] w-full px-4 py-2 rounded-2xl hover:bg-yellow-600 cursor-pointer"
            onClick={() => handleClickBtn(product.slug)}
          >
            درخواست رزرو
          </button>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={WarningMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={ErrorMessage}
      />
    </>
  );
};

export default GetAllProduct;
