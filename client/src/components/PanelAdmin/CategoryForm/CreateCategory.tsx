import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import CategoryForm, { type CategoryFormData } from "./CategoryForm";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      const payload: any = {
        name: String(data.name).trim(),
        slug: String(data.slug).trim(),
        ownership: Boolean(data.ownership ?? false),
      };
      if (data.description && data.description.trim() !== "") {
        payload.description = String(data.description).trim();
      }
      const response = await axiosClient.post("/categories", payload);
      console.log("response create:", response.data);
      if (response.status === 201) {
        setSuccessMessage("دسته بندی جدید با موفقیت ساخته شد");
        setIsSuccessOpen(true);
        setTimeout(() => {
          navigate("/panel/category");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error create:", err.message);
      if (err.response?.status === 403) {
        setWarningMessage(
          "شما دسترسی لازم برای ایجاد دسته بندی جدید را ندارید.",
        );
      } else if (err.response?.status === 409) {
        setWarningMessage(
          "این دسته بندی قبلا ثبت شده است. از نام دیگری استفاده کنید",
        );
      } else {
        setWarningMessage("خطا در ایجاد دسته بندی. لطفا مجدد تلاش کنید");
      }
      setIsWarningOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CategoryForm
        mode="create"
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="ایجاد دسته بندی"
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

export default CreateCategory;
