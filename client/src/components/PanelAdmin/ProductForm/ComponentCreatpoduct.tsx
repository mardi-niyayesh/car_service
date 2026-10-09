
import axiosClient from "../../../services/axiosClient";
import ProductFormComponent from "./ProductFormComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";

type PayloadType = {
  name: string;
  slug: string;
  company: string;
  price_per_day: number;
  category_id: string;
  tags: string[];
  can_rent: boolean;
  ownership: boolean;
  description?: string;
};

type ProductFormData = PayloadType & {
  selectedImage?: File | null;
};

const ComponentCreatpoduct = () => {
  const navigate = useNavigate();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const description = String(data.description ?? "").trim();

      if (description.length > 0 && description.length < 5) {
        setIsWarningOpen(true);
        setWarningMessage(
          "توضیحات باید حداقل ۵ کاراکتر داشته باشد.",
        );
        return;
      }

      const payload: PayloadType = {
        name: String(data.name).trim(),
        slug: String(data.slug).trim(),
        company: String(data.company).trim(),
        price_per_day: Number(data.price_per_day),
        category_id: String(data.category_id).trim(),
        tags: data.tags,
        can_rent: data.can_rent ?? true,
        ownership: data.ownership ?? false,
      };

      if (description.length >= 5) {
        payload.description = description;
      }

    
      const response = await axiosClient.post("/cars", payload);

      const carId = response.data?.response?.data?.car?.id;

      if (!carId) {
        throw new Error("شناسه ماشین در پاسخ سرور پیدا نشد.");
      }

      if (data.selectedImage) {
        const formData = new FormData();
        formData.append("image", data.selectedImage);

        await axiosClient.post(
          `/cars/${carId}/image`,
          formData,
        );
      }
      setSuccessMessage(
        data.selectedImage
          ? "ماشین و عکس آن با موفقیت ثبت شدند."
          : "ماشین با موفقیت ساخته شد.",
      );
      setIsSuccessOpen(true);

      setTimeout(() => {
        navigate("/panel/product");
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          "شما مجوز لازم (owner.all یا product.create) را ندارید.",
        );
      } else if (err.response?.status === 409) {
        setIsWarningOpen(true);
        setWarningMessage(
          "محصول با لینک مشابه در دیتابیس وجود دارد؛ لطفاً لینک دیگری انتخاب کنید.",
        );
      } else if (err.response?.status === 400) {
        const errors = err.response?.data?.errors;
        const descriptionError = errors?.find(
          (item: any) => item.field === "description",
        );

        setIsWarningOpen(true);
        setWarningMessage(
          descriptionError
            ? "توضیحات باید حداقل ۵ کاراکتر داشته باشد."
            : "اطلاعات ارسالی معتبر نیست؛ لطفاً فیلدها را بررسی کنید.",
        );
      } else {
        setIsErrorOpen(true);
        setErrorMessage(
          "عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        );
      }
    }
  };

  return (
    <div>
      <ProductFormComponent
        mode="create"
        onSubmit={handleAddProduct}
        submitButtonText="اضافه کردن ماشین"
      />

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

export default ComponentCreatpoduct;
