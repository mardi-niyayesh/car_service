import { useForm } from "react-hook-form";
import { useUpdateUser } from "../Api/ApiUpdatUser";

type FormData = {
  display_name: string;
  age: string;
};

const ComponentFormUpdateUser = () => {
  const FetchUpdateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await FetchUpdateUser({
        display_name: data.display_name,
        age: Number(data.age),
      });
      if (result.ok) {
        console.log("success:", result);
      }

      reset();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
    >
      <div className="p-6 bg-white">
        <p className="text-[#4b33b5] text-[20px] font-bold mb-4">
          فرم ویرایش کاربر
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کامل
            </label>
            <input
              type="text"
              {...register("display_name", {
                required: "نام الزامی است",
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              سن کاربر
            </label>
            <input
              type="tel"
              {...register("age", {
                required: "سن الزامی است",
                min: {
                  value: 0,
                  message: "سن نباید منفی باشد",
                },
                max: {
                  value: 120,
                  message: "سن نباید بیشتر از 120 باشد",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "سن باید عدد باشد",
                },
              })}
              placeholder="سن کاربر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
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
  );
};

export default ComponentFormUpdateUser;
