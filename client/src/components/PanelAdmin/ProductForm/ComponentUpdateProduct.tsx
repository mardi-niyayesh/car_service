import { useParams } from "react-router-dom";
import { useEffect } from "react";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import axiosClient from "../../../services/axiosClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductFormComponent, {
  type ProductFormType,
} from "./ProductFormComponent";

type payloadType = {
  name: string;
  slug: string;
  company: string;
  price_per_day: number;
  category_id: string;
  tags: any;
  can_rent: any;
  ownership: any;
  description?: string;
};

const ComponentUpdateProduct = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Id for a car :", id);
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState<ProductFormType | null>(
    null,
  );
  const [oldlData, setOldData] = useState<ProductFormType | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.put(`cars/${id}`);
        const data = response.data.response.data.car;
        const initial = {
          name: data.name,
          slug: data.slug,
          company: data.company,
          price_per_day: data.price_per_day,
          category_id: data.category_id,
          can_rent: data.can_rent,
          ownership: data.ownership,
          description: data.description,
        };
        setDefaultValues(initial);
        setOldData(initial);
      } catch (err: any) {
        console.error("Error in Get Product:", err);
        if (err.response?.status === 404) {
          setWarningMessage("این ماشین  در دیتابیس وجود ندارد");
          setIsWarningOpen(true);
        } else {
          setIsWarningOpen(true);
          setWarningMessage("خطا در دریافت اططلاعات  ماشین ");
        }
        setTimeout(() => navigate("/panel/product"), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleUpdateProduct = async (data: ProductFormType) => {
    setIsLoading(true);

    const payload: Partial<payloadType> = {};

    if (data.name !== oldlData?.name) payload.name = String(data.name.trim());
    if (data.slug !== oldlData?.slug) payload.slug == String(data.slug.teim());
    try {
      const response = await axiosClient.put(`cars/${id}`, payload);

      const data = response.data.response.data.car;
      console.log("initial data to car :", data);
      setDefaultValues(data);

      if (response.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("اپدیت محصول شما با موفقیت انجام شد ");
        setTimeout(() => {
          navigate("panel/product");
        }, 3000);
      }
    } catch (err: any) {
      console.log("Error in updating product :", err);
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          "شما مجوز لازم (owner or product.update) را برای اپدیت کردن ماشین ندارید",
        );
      } else if (err.response?.status === 404) {
        setIsWarningOpen(true);
        setWarningMessage(
          "ماشین مورد نظر در دیتابیس وجود ندارد لطفا رفرش کنید .",
        );
      } else if (err.response?.status === 409) {
        const message = err.response?.data?.message;
        const conflictMatch = message.match(/conflict fields:\s*(.+)/);

        if (conflictMatch) {
          const conflictFields = conflictMatch[1]
            .split(",")
            .map((f) => f.trim());

          if (conflictFields.includes("category_id")) {
            setWarningMessage(
              "ایدی دسته‌بندی تکراری است. لطفاً دسته‌بندی دیگری انتخاب کنید.",
            );
          } else if (conflictFields.includes("slug")) {
            setWarningMessage(
              "این لینک (slug) قبلاً برای ماشین دیگری استفاده شده است. لطفاً لینک دیگری وارد کنید.",
            );
          } else if (conflictFields.includes("name")) {
            setWarningMessage(
              "این نام ماشین قبلاً ثبت شده است. لطفاً نام دیگری انتخاب کنید.",
            );
          }
        }

        setIsWarningOpen(true);
      } else {
        setIsErrorOpen(true);
        setErrorMessage(
          "خطایی در سرور رخ داده است لطفا لحاظاتی دیگر مجدد تلاش کنید.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ProductFormComponent
        mode="update"
        // defaultValues={defaultValues}
        onSubmit={handleUpdateProduct}
        submitButtonText="ویرایش ماشین"
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
    </>
  );
};

export default ComponentUpdateProduct;
