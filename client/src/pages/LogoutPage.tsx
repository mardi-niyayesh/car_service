import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../components/Dashboard/APi/ApiLogoutUser";
import WarningModal from "../Modal/WarningModal ";
import SuccessModal from "../Modal/SuccessModal";
import ErrorModal from "../Modal/ErrorModal";
import { useUser } from "../hooks/useUser";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    setIsModalOpen(false);
    setIsErrorModalOpen(false);

    try {
      const result = await LogoutUser();

      if (!result) {
        setErrorMessage("پاسخی از سرور دریافت نشد");
        setIsErrorModalOpen(true);
        setIsLoading(false);
        return;
      }

      if (result.success === true) {
        setModalMessage("شما با موفقیت از حساب کاربری خود خارج شدید");
        logout();
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (result.statusCode === 401) {
        setWarningMessage(
          `نشست شما به پایان رسیده است . لطفا برای ادامه کار مجدد وارد حساب کاربری خود شوید`,
        );
        setIsWarningModalOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (result.statusCode === 403) {
        setWarningMessage(
          ` نشست شما در دستگاه دیگری پایان یافته است.
        اگر خودتان وارد سیستم شده‌اید، لطفاً مجدداً وارد شوید.
        اگر این کار را نکرده‌اید، برای امنیت حساب خود رمز عبور را تغییر دهید.`,
        );
        setIsWarningModalOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (result.statusCode === 500) {
        setErrorMessage("خطای سرور. لطفاً بعداً دوباره تلاش کنید.");
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      console.log("خطا :", err);
      setErrorMessage("خطا در برقراری ارتباط با سرور. لطفا مجدد تلاش کنید");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen bg-gray-50"
      dir="rtl"
    >
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <p className="text-[#212121] text-xl sm:text-2xl md:text-3xl font-bold pb-3 inline-block">
            خروج
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md mx-auto md:mx-0">
          <div className="text-[#212121] sm:text-lg md:text-xl font-medium text-center mb-8">
            برای خروج از حساب کاربری خود اطمینان دارید؟
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <button className="text-[#DB1D27] border-2 border-[#DB1D27] px-6 sm:px-8 py-3 rounded-xl hover:text-white hover:bg-[#DB1D27] transition-all duration-300 font-medium text-sm sm:text-base w-full sm:w-auto">
                انصراف
              </button>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`text-white bg-[#DB1D27] border-2 border-[#DB1D27] px-6 sm:px-8 py-3 rounded-xl hover:bg-white hover:text-[#DB1D27] transition-all duration-300 font-medium text-sm sm:text-base w-full sm:w-auto ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "در حال خروج..." : "خروج از حساب"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SuccessModal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={() => {
            setIsModalOpen(false);
            navigate("/login");
          }}
        />
      )}

      {isErrorModalOpen && (
        <ErrorModal
          isOpen={isErrorModalOpen}
          message={errorMessage}
          onClose={() => {
            setIsErrorModalOpen(false);
          }}
        />
      )}
      <WarningModal
        isOpen={isWarningModalOpen}
        message={warningMessage}
        onClose={() => {
          setIsWarningModalOpen(false);
        }}
        title=" توجه"
      />
    </div>
  );
};

export default LogoutPage;
