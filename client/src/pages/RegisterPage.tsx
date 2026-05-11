//hooks
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//components
import AuthForm from "../components/common/AuthForm";
// types
import { type RegisterFormData } from "../types/auth.types";
//api
import { registerUser } from "../services/api";
//Modals
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";
import WarningModal from "../components/common/WarningModal ";

function RegisterPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.statusCode === 400) {
        setWarningMessage(`اطلاعات شما با قوانین ثبت‌نام همخوانی ندارد.
      لطفاً مطمئن شوید:
       • ایمیل صحیح است
      • رمز عبور حداقل ۶ کاراکتر (شامل حرف و عدد)
      • نام کاربری حداقل ۳ کاراکتر
      • سن بین ۰ تا ۱۲۰ سال`);
        setIsWarningModalOpen(true);
      } else if (data.statusCode === 409) {
        setWarningMessage("کاربری با این مشخصات قبلا ثبت نام کرده است");
        setIsWarningModalOpen(true);
      } else if (data.statusCode === 500) {
        setErrorMessage("خطای سرور. لطفاً بعداً دوباره تلاش کنید.");
        setIsErrorModalOpen(true);
      } else if (data.statusCode === 429) {
        setErrorMessage("لطفا 5 دقیقه دیگر مجدد تلاش کنید");
        setIsErrorModalOpen(true);
      } else {
        setModalMessage(
          "ثبت‌نام شما با موفقیت انجام شد! به خانواده کارسرویس خوش آمدید.",
        );
        setIsModalOpen(true);
      }
    },
    onError: (error: Error) => {
      console.error("خطا:", error);
      setErrorMessage("خطایی در ثبت‌نام رخ داد. لطفاً مجدداً تلاش کنید.");
      setIsErrorModalOpen(true);
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

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
        type="register"
        onSubmit={handleRegister}
        isPending={mutation.isPending}
        error={mutation.error?.message}
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
}

export default RegisterPage;
