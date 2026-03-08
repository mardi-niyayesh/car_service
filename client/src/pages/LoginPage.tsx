//hooks
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//components
import AuthForm from "../components/common/AuthForm";
//api
import { loginUser } from "../services/api";
//types
import { type LoginFormData } from "../types/auth.types";
//Modal
import SuccessModal from "../components/common/SuccessModal";
import ErrorModal from "../components/common/ErrorModal";
import WarningModal from "../components/common/WarningModal ";

function LoginPage() {
  const navigate = useNavigate();
  //SuccessModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //ErrorModal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //WarningModal
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const token = data?.response?.data?.accessToken;
      //error 400
      if (data.statusCode === 400) {
        setWarningMessage(`مشکلی در اطلاعات ورود وجود داره:
          ایمیل رو با فرمت صحیح وارد کن
      رمز عبور باید حداقل ۶ تا حرف و عدد داشته باشه
      مقدار "مرا به خاطر بسپار" رو درست انتخاب کن `);
        setIsErrorModalOpen(true);
      }
      //error 401
      else if (data.statusCode === 401) {
        setModalMessage("اییمل یا رمز عبور اشتباه است لطفا مجدد تلاش کنید");
        setIsWarningModalOpen(true);
      }
      //error 500
      else if (data.statusCode === 500) {
        setErrorMessage("خطای سرور. لطفاً بعداً دوباره تلاش کنید.");
        setIsErrorModalOpen(true);
      }
      //success
      else if (token) {
        localStorage.setItem("token", token);
        setModalMessage(
          "ورود شما با موفقیت انجام شد! به خانواده کارسرویس خوش آمدید.",
        );
        setIsModalOpen(true);
      }
      //other error
      else {
        // console.error("پاسخ:", data);
        setErrorMessage("خطایی در ورود رخ داد. لطفاً مجدداً تلاش کنید.");
        setIsErrorModalOpen(true);
      }
    },

    onError: (error: Error) => {
      console.error("خطا:", error);
      setErrorMessage(
        error.message || "خطایی در ورود رخ داد. لطفاً مجدداً تلاش کنید.",
      );
      setIsErrorModalOpen(true);
    },
  });

  const handleLogin = (data: LoginFormData) => {
    mutation.mutate(data);
  };
  //SuccessModal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };
  //ErrorModal
  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };
  // WarningModal
  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  return (
    <>
      <AuthForm
        type="login"
        onSubmit={handleLogin}
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

export default LoginPage;
