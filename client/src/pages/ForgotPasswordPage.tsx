//components
import AuthForm from "../components/common/AuthForm";
//modal
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";
import WarningModal from "../components/common/WarningModal ";
//api
import { forgotPassword } from "../services/api";
//hook
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const mutation = useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data.email),
    onSuccess: (data) => {
      console.log("success", data);

      if (data.statusCode === 404) {
        setWarningMessage(
          "شما ثبت نام نکرده اید . ابتدا وارد حساب کاربری خود شوید",
        );
        setIsWarningModalOpen(true);
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      } else if (data.statusCode === 409) {
        setWarningMessage(
          "یک لینک فعال قبلاً برای این ایمیل ارسال شده است. لطفاً صندوق ورودی یا اسپم خود را بررسی کنید.",
        );
        setIsWarningModalOpen(true);
      } else if (data.statusCode === 500) {
        setErrorMessage("خطای سرور. لطفاً بعداً دوباره تلاش کنید.");
        setIsErrorModalOpen(true);
      } else if (data.success === false) {
        setWarningMessage("خطایی رخ داده است");
        setIsWarningModalOpen(true);
      } else {
        setModalMessage(
          "لینک بازیابی رمز عبور با موفقیت برای ایمیل شما ارسال شد",
        );
        setIsModalOpen(true);
      }
    },
    onError: (error: any) => {
      console.error("خطا:", error);

      if (error?.status === 409 || error?.message?.includes("409")) {
        setWarningMessage(
          "یک لینک فعال قبلاً برای این ایمیل ارسال شده است. لطفاً صندوق ورودی یا اسپم خود را بررسی کنید.",
        );
        setIsWarningModalOpen(true);
      } else {
        setErrorMessage(
          "خطایی در ارسال لینک بازیابی رخ داد لطفا ایمیل خود را مجدد وارد کنید",
        );
        setIsErrorModalOpen(true);
      }
    },
  });

  const handleSubmit = (data: { email: string }) => {
    mutation.mutate(data);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/reset-password");
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
        type="forgot-password"
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        error={mutation.error?.message}
        successMessage={
          mutation.isSuccess
            ? mutation.data?.message ||
              "لینک بازیابی رمز عبور به ایمیل شما ارسال شد"
            : null
        }
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
        message={WarningMessage}
        title="توجه"
      />
    </>
  );
};

export default ForgotPasswordPage;
