import { useForm } from "react-hook-form";
import { useUpdateUser } from "../Api/ApiUpdatUser";
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  display_name: string;
  age: string;
};

const ComponentFormUpdateUser = () => {
  const navigate = useNavigate();
  const FetchUpdateUser = useUpdateUser();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const payload: { display_name?: string; age?: number } = {};

    if (data.display_name && data.display_name.trim() !== "") {
      payload.display_name = data.display_name.trim();
    }
    if (data.age !== "" && data.age !== undefined && !isNaN(Number(data.age))) {
      payload.age = Number(data.age);
    }
    if (Object.keys(payload).length === 0) {
      setWarningMessage(
        " حدالقل یک فیلد را باید تغییر دهید نام یا اسم یا هر دو",
      );
      setIsWarningOpen(true);
      return;
    }
    console.log("Sending payload:", payload);
    try {
      const result = await FetchUpdateUser(payload);
      if (result.ok) {
        console.log("success in updat information user:", result);
        setSuccessMessage(result.message);
        // setInterval(() => {
        //   navigate("/panel/profile");
        // }, 5000);
        setIsSuccessOpen(true);
        reset();
      } else {
        setWarningMessage(result.message);
        setIsWarningOpen(true);
      }

      reset();
    } catch (err) {
      console.log("Error in update information user :", err);
      console.log("Full error response:", err.response?.data);
      setWarningMessage(err.response?.data?.message);
      setIsWarningOpen(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
      >
        <div className="p-6 bg-white">
          <span className="text-blue-800 text-[20px] font-medium mb-4">
            فرم ویرایش کاربر
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-3">
                نام کامل
              </label>
              <input
                type="text"
                {...register("display_name", {
                  minLength: {
                    value: 3,
                    message: "نام باید حداقل ۳ حرف داشته باشد",
                  },
                  pattern: {
                    value: /^[\u0600-\u06FFa-zA-Z\s]+$/,
                    message: "نام باید فقط شامل حروف باشد",
                  },
                })}
                placeholder="کاربر جدید"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.display_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-3">
                سن کاربر
              </label>
              <input
                type="number"
                {...register("age", {
                  min: {
                    value: 0,
                    message: "سن نباید منفی باشد",
                  },
                  max: {
                    value: 120,
                    message: "سن نباید بیشتر از 120 باشد",
                  },
                })}
                placeholder="سن کاربر"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-[15px] mb-4">
            توجه : شما می توانید اسم یا سن یا هر دو را تغییر دهید{" "}
          </p>
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
