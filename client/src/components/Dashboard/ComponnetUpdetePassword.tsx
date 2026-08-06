import { useForm } from "react-hook-form";
import { useUpdatePassword } from "./APi/ApiUpdatPassword";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  oldPassword: string;
  newPassword: string;
};

const ComponnetUpdetePassword = () => {
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const FetchUpdatePassword = useUpdatePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await FetchUpdatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      if (result.ok) {
        setIsSuccessOpen(true);
        setSuccessMessage(result.message);
        reset();
      } else {
        setIsWarningOpen(true);
        setWarningMessage(result.message);
      }
      reset();
    } catch (err) {
      // console.log("Error in update password uder:", err);
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
      >
        <div className="p-6 bg-white">
          <span className="text-gray-800 text-[20px] font-bold mb-4">
            ویرایش رمز عبور
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8 mt-5">
            <div>
              <label className="block font-medium text-gray-500 mb-1">
                رمز عبور فعلی<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("oldPassword", {
                  required: "رمز عبور فعلی الزامی است",
                  minLength: {
                    value: 6,
                    message: "رمز عبور باید حدالقل 6 کاراکتر داشته باشد",
                  },
                  pattern: {
                    value: /^(?=.*[a-zA-Z]).{6,}$/,
                    message: "رمز عبور باید حداقل شامل یک حرف باشد.",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block  text-gray-500 mb-1">
                رمز عبور جدید <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("newPassword", {
                  required: "رمز عبور جدید الزامی است",
                  minLength: {
                    value: 6,
                    message: "رمز عبور باید حداقل 6 کاراکتر داشته باشد",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 w-full md:w-auto"
          >
            ثبت اطلاعات
          </button>
        </div>
      </form>
      <p
        onClick={goBack}
        className="w-fit mr-auto text-gray-500 text-2xl  border p-1 rounded border-gray-0 border-none bg-gray-200 mt-1.5 cursor-pointer"
      >
        بازگشت
      </p>
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={WarningMessage}
      />
    </>
  );
};

export default ComponnetUpdetePassword;
