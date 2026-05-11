//components
import AuthForm from "../components/common/AuthForm";
//Modal
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";
import WarningModal from "../components/common/WarningModal ";
//hooks
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
//api
import { resetPassword } from "../services/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("پاسخ سرور:", data);

      if (data.success === true) {
        setModalMessage(data.message || "رمز عبور شما با موفقیت تغییر کرد");
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else if (data.statusCode === 400) {
        setWarningMessage(
          "اطلاعات وارد شده معتبر نیست.\n" +
            "لطفاً رمز عبور جدید را با شرایط زیر وارد کنید:\n" +
            "• حداقل ۶ کاراکتر\n" +
            "• شامل حروف و اعداد",
        );
        setIsWarningModalOpen(true);
      } else if (data.statusCode === 401) {
        setWarningMessage(
          " لینک بازیابی رمز عبور منقضی شده است.\n" +
            "لطفاً مجدداً درخواست بازیابی رمز بدهید.",
        );
        setIsWarningModalOpen(true);
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      } else if (data.statusCode === 409) {
        setWarningMessage(
          " این لینک قبلاً استفاده شده است.\n" +
            "اگر نیاز به تغییر رمز دارید، مجدداً درخواست بدهید.",
        );
        setIsWarningModalOpen(true);
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      } else {
        setErrorMessage("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
        setIsErrorModalOpen(true);
      }
    },
    onError: (error: any) => {
      console.error("خطا:", error);
      setErrorMessage(error?.message || "خطا در ارتباط با سرور");
      setIsErrorModalOpen(true);
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  return (
    <>
      <AuthForm
        type="reset-password"
        onSubmit={mutate}
        isPending={isPending}
        error={error?.message}
        token={token}
      />

      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />

      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={handleCloseWarningModal}
        message={warningMessage}
        title=" توجه"
      />
    </>
  );
};

export default ResetPasswordPage;
