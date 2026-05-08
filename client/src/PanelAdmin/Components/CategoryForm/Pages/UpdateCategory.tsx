import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../../services/axiosClient";

import CategoryForm, { type CategoryFormData } from "../CategoryForm";
import SuccessModal from "../../../../components/common/SuccessModal";
import WarningModal from "../../../../components/common/WarningModal ";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  // console.log(" id in category:", id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [defaultValues, setDefaultValues] = useState<CategoryFormData | null>(
    null,
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
  
    const fetchCategory = async () => {
      try {
        const response = await axiosClient.get(`/categories/${id}`);
        console.log("response to get infomation  category :", response);

        const data = response.data?.response?.data?.category;
        console.log("data in get information category :", data);

        setDefaultValues({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          ownership: false,
        });
      } catch (err: any) {
        console.error("Error in Get category:", err);
        setWarningMessage("خطا در دریافت اطلاعات دسته بندی");
        setIsWarningOpen(true);
        setTimeout(() => navigate("/panel/category"), 3000);
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchCategory();
  }, [id, navigate]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      await axiosClient.put(`/categories/${id}`, {
        name: String(data.name).trim(),
        slug: String(data.slug).trim(),
        description: String(data.description || "").trim(),
        ownership: Boolean(data.ownership),
      });
      setSuccessMessage("دسته بندی با موفقیت به‌روزرسانی شد");
      setIsSuccessOpen(true);
      setTimeout(() => {
        navigate("/panel/category");
      }, 3000);
    } catch (err: any) {
      console.error("Error update:", err);
      if (err.response?.status === 403) {
        setWarningMessage(
          "شما دسترسی لازم برای اپدیت این دسته بندی رو ندارین  باید (owner /category.update/سازنده اون دسته بندی) باشید",
        );
      } else if (err.response?.status === 409) {
        const message = err.response?.data?.message || "";
        if (
          message.includes("Category already exists") ||
          message.includes("please change slug")
        ) {
          setWarningMessage(
            "این slug قبلاً برای دسته بندی دیگری استفاده شده است. لطفاً slug دیگری وارد کنید.",
          );
        } else if (message.includes("At least one field must differ")) {
          setWarningMessage(
            "هیچ تغییری در اطلاعات ایجاد نشده است. حداقل یک فیلد را تغییر دهید.",
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
