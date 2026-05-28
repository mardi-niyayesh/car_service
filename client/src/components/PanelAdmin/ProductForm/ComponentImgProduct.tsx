import axiosClient from "../../../services/axiosClient";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ComponentImgProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log(" Id priduct to click :", id);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [selecedtImg, setSelecedtImg] = useState<File | null>(null);

  const handleImgProduct = async (e) => {
    e.preventDefault();

    if (!selecedtImg) {
      setIsWarningOpen(true);
      setWarningMessage("لطفاً یک فایل تصویر انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selecedtImg);
    try {
      const response = await axiosClient.post(`cars/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage(
          "شما با موفقیت تصویر را برای محصول مورد نظر اپلود کردید.",
        );
        setSelecedtImg(null);
        setTimeout(() => {
          navigate("/panel/product");
        }, 3000);
      }
    } catch (err: any) {
      console.log("Error in upload img to ptoduct :", err);
      if (err.response?.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "فرمت عکس اپلود شده فقط میتواند (jpg, jpeg, png, webp)باشد",
        );
      } else if (err.response?.status == 404) {
        setIsWarningOpen(true);
        setWarningMessage(
          "ماشن مورد نظر در دیتابیس وجود ندارد که بخواهید عکسی براش اپلود کنید لطفا صفحه رو رفرش کنید",
        );
      } else if (err.response?.status == 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          " شما مجوز لازم (product.update or product.create) را ندارید",
        );
      } else {
        setIsErrorOpen(true);
        setErrorMessage(
          " خطایی در سرور رخ داده است لطفا لحاظاتی دیگر مجدد امتحان کنید",
        );
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleImgProduct}>
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-3">
            آپلود عکس ماشین
          </label>
          <input
            accept="image/jpeg, image/png, image/webp"
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelecedtImg(e.target.files[0]);
              } else {
                setSelecedtImg(null);
              }
            }}
            className="w-full border border-gray-300 rounded-lg text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm"
          />
        </div>
        <p className="text-gray-500 text-[15px] m-2.5">توجه : فرمت عکس وارد شده فقط میتواند : jpg, jpeg, png, webp</p>

        <button
          type="submit"
          className="py-2 px-3 mt-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50"
        >
          اضافه کردن عکس ماشین
        </button>
      </form>
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
        message={ErrorMessage}
      />
    </div>
  );
};

export default ComponentImgProduct;
