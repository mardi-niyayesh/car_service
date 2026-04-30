import { useForm } from "react-hook-form";
import { useUpdatePassword } from "../Api/ApiUpdatPassword";
import { Link } from "react-router-dom";
//Modal
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";
import { useState } from "react";

type FormData = {
  oldPassword: string;
  newPassword: string;
};

const ComponentFormUpdateUser = () => {
  //success Modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  //Warning Modal
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
        console.log("success:", result);
        setIsSuccessOpen(true);
        setSuccessMessage(result.message);
        reset();
      } else {
        setIsWarningOpen(true);
        setWarningMessage(result.message);
      }
      reset();
    } catch (err) {
      console.log("Error in update password uder:", err);
    }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور فعلی
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
                placeholder="رمز عبور فعلی"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور جدید
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
                placeholder="رمز عبور جدید"
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
            className="py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 w-full md:w-auto"
          >
            ثبت اطلاعات
          </button>
        </div>
      </form>
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

export default ComponentFormUpdateUser;
