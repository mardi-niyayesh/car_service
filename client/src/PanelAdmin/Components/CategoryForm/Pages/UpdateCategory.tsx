import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../../services/axiosClient";
import CategoryForm, { type CategoryFormData } from "../CategoryForm";
import SuccessModal from "../../../../components/common/SuccessModal";
import WarningModal from "../../../../components/common/WarningModal ";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [defaultValues, setDefaultValues] = useState<CategoryFormData | null>(
    null,
  );
  const [oldlData, setOldData] = useState<CategoryFormData | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosClient.get(`/categories/${id}`);
        const data = response.data?.response?.data?.category;
        console.log("response to information category :", data);

        const initial = {
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          ownership: data.ownership ?? false,
        };
        setDefaultValues(initial);
        setOldData(initial);
      } catch (err: any) {
        console.error("Error in Get category:", err);
        if (err.response?.status === 404) {
          setWarningMessage("این دسته بندی در دیتابیس وجود ندارد");
          setIsWarningOpen(true);
        } else {
          setIsWarningOpen(true);
          setWarningMessage("خطا در دریافت اططلاعات دسته بندی");
        }
        setTimeout(() => navigate("/panel/category"), 3000);
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchCategory();
  }, [id, navigate]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);

    const payload: Partial<CategoryFormData> = {};
    if (data.name !== oldlData?.name) payload.name = data.name.trim();
    if (data.slug !== oldlData?.slug) payload.slug = data.slug.trim();
    if (data.description !== oldlData?.description)
      payload.description = data.description.trim();
    if (data.ownership !== oldlData?.ownership)
      payload.ownership = data.ownership;

    if (Object.keys(payload).length === 0) {
      setWarningMessage("هیچ تغییری در فیلدهای مربوطه اعمال نشد");
      setIsWarningOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending update payload:", payload);
      await axiosClient.put(`/categories/${id}`, payload);
      setSuccessMessage("دسته بندی با موفقیت به‌روزرسانی شد");
      setIsSuccessOpen(true);
      setTimeout(() => {
        navigate("/panel/category");
      }, 3000);
    } catch (err: any) {
      console.error("Error update:", err);
      console.error("Full error response:", err.response?.data);
      if (err.response?.status === 403) {
        setWarningMessage(
          "شما دسترسی لازم برای اپدیت این دسته بندی رو ندارید (owner / category.update / سازنده اون دسته بندی) میتونن اپدیت کنن",
        );
      } else if (err.response?.status === 409) {
        const message = err.response?.data?.message ;
        if (
          message.includes("Category already exists") ||
          message.includes("please change slug")
        ) {
          setWarningMessage(
            "این لینک قبلاً برای دسته بندی دیگری استفاده شده است. لطفاً لینک دیگری وارد کنید.",
          );
        } else {
          setWarningMessage("خطای تداخل (Conflict) رخ داده است.");
        }
      } else {
        setWarningMessage("خطا در اپدیت دسته بندی. لطفا مجدد تلاش کنید");
      }
      setIsWarningOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  if (!defaultValues) {
    return (
      <div className="text-center p-8 text-red-500">دسته بندی یافت نشد</div>
    );
  }

  return (
    <>
      <CategoryForm
        mode="update"
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="ذخیره تغییرات"
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
    </>
  );
};

export default EditCategory;
