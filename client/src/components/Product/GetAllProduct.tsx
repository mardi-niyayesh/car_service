import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { type ProductFormType } from "../PanelAdmin/ProductForm/ProductFormComponent";
import axiosClient from "../../services/axiosClient";
import { useUser } from "../../hooks/useUser";
import WarningModal from "../../Modal/WarningModal ";
import SuccessModal from "../../Modal/SuccessModal";
import ErrorModal from "../../Modal/ErrorModal";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ProductProps = {
  product: ProductFormType;
};

const GetAllProduct = ({ product }: ProductProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLiked, setIsLiked] = useState(false);

  const handleClickBtn = (slug: string) => {
    navigate(`/detailcar/${slug}`);
  };

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsLiked(false);

        return;
      }

      try {
        const response = await axiosClient.get(`favorites/check/${product.id}`);

        const data = response.data.response.data;

        setIsLiked(data.is_favorite);
      } catch (err) {
        setIsLiked(false);
      }
    };

    checkFavorite();
  }, [product.id, user]);

  const handleToggleLike = async () => {
    if (!user) {
      setIsWarningOpen(true);
      setWarningMessage("ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      if (!isLiked) {
        await axiosClient.post(`favorites/${product.id}`);

        setIsLiked(true);

        setIsSuccessOpen(true);
        setSuccessMessage("این ماشین به علاقه مندی ها اضافه شد");
      } else {
        await axiosClient.delete(`favorites/${product.id}`);

        setIsLiked(false);

        setIsSuccessOpen(true);
        setSuccessMessage("این ماشین از علاقه مندی ها حذف شد");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        try {
          const checkRes = await axiosClient.get(
            `favorites/check/${product.id}`,
          );

          const checkData = checkRes.data.response.data;

          setIsLiked(checkData.is_favorite);

          setIsWarningOpen(true);

          setWarningMessage(":) این ماشین قبلا توسط شما لایک شده است");
        } catch {
          setIsWarningOpen(true);
          setWarningMessage("خطا در دریافت اطلاعات");
        }
      } else if (err.response?.status === 404) {
        setIsLiked(false);

        setIsWarningOpen(true);

        setWarningMessage("این ماشین در لیست علاقه‌مندی‌های شما وجود ندارد");
      } else {
        setIsErrorOpen(true);
        setErrorMessage("خطا در سرور");
      }
    }
  };

  if (!product) {
    return (
      <div className="py-8 text-center text-gray-500">
        در این دسته بندی محصولی وجود ندارد
      </div>
    );
  }

  return (
    <>
      <motion.article
        initial={{
          opacity: 0,
          y: 15,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        whileHover={{
          y: -4,
        }}
        className="
          group
          flex
          h-full
          w-full
          min-w-0
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          transition-shadow
          duration-300
          hover:shadow-lg
        "
      >
        <div
          className="
            relative
            flex
            w-full
            items-center
            justify-center
            overflow-hidden
            bg-gray-50
            px-4
            py-5
            sm:px-5
            sm:py-6
          "
        >
          <motion.img
            src={`/${product.image}`}
            alt={product.name}
            loading="lazy"
            decoding="async"
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="
              block
              h-auto
              max-h-44
              w-full
              max-w-[280px]
              object-contain
              sm:max-h-48
              md:max-h-52
            "
          />
        </div>

        <div
          className="
            flex
            flex-1
            flex-col
            p-3.5
            sm:p-4
            md:p-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              justify-between
              gap-2
            "
          >
            <h2
              className="
                min-w-0
                flex-1
                truncate
                text-base
                font-bold
                text-gray-900
                sm:text-lg
              "
            >
              {product.name}
            </h2>

            <button
              type="button"
              onClick={handleToggleLike}
              aria-label={
                isLiked ? "حذف از علاقه مندی" : "افزودن به علاقه مندی"
              }
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gray-50
                transition-all
                duration-200
                hover:bg-red-50
                active:scale-90
              "
            >
              <motion.span
                animate={{
                  scale: isLiked ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                {isLiked ? (
                  <FaHeart size={17} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={20} className="text-red-500" />
                )}
              </motion.span>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-50
                px-2.5
                py-1
                text-xs
                text-gray-600
              "
            >
              <FaHeart size={12} className="text-red-400" />

              <span>{product?._count?.users_favorites || 0}</span>
            </div>

            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-50
                px-2.5
                py-1
                text-xs
                text-gray-600
              "
            >
              <FaRegComment size={12} className="text-blue-400" />

              <span>{product?._count?.comments || 0}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className=" truncate text-[12px] font-bold text-gray-800    ">
                کمپانی :
              </span>

              <span className="shrink-0 text-xs text-gray-400 sm:text-sm ">
                {product.company}
              </span>
            </div>

            <div
              className="
      flex
      shrink-0
      items-center
      gap-1.5
      px-2.5
      py-1.5
      sm:px-3
      sm:py-2
    "
            >
              <span className="text-[10px] text-gray-500 sm:text-xs">
                روزانه
              </span>

              <span className="text-xs font-extrabold text-[#05164D] sm:text-sm">
                {product.price_per_day}
              </span>

              <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                تومان
              </span>
            </div>
          </div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {product.description}
          </p>

          <motion.button
            type="button"
            onClick={() => handleClickBtn(product.slug)}
            whileTap={{
              scale: 0.97,
            }}
            className="
              mt-auto
              pt-4
            "
          >
            <span
              className="
                block
                w-full
                rounded-xl
                bg-[#FDB713]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition-all
                duration-300
                hover:bg-[#E5A500]
                hover:shadow-md
                sm:py-3
              "
            >
              درخواست رزرو
            </span>
          </motion.button>
        </div>
      </motion.article>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={warningMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errorMessage}
      />
    </>
  );
};

export default GetAllProduct;
