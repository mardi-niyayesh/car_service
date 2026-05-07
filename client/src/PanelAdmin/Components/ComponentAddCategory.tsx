import axiosClient from "../../services/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";
import { useNavigate } from "react-router-dom";

const ComponentAddCategory = () => {
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  type CategoryType = {
    name: string;
    description: string;
    slug: string;
    ownership: boolean;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      ownership: false,
    },
  });

  const watchSlug = watch("slug");

  const handleSlugChange = (e) => {
    let value = String(e.target.value);
    value = value.toLowerCase();
    value = value.replace(/[^a-z0-9-]/g, "");
    value = value.replace(/-+/g, "-");
    value = value.replace(/^-|-$/g, "");
    setValue("slug", value, { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryType) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/categories", {
        name: String(data.name).trim(),
        slug: String(data.slug).trim(),
        description: String(data.description || "").trim(),
        ownership: Boolean(data.ownership),
      });
      console.log("response to create category:", response.data);
      setSuccessMessage("دسته بندی جدید با موفقیت ساخته شد");
      setIsSuccessOpen(true);
      setTimeout(() => {
        navigate("/panel/category");
      }, 3000);

      reset();
    } catch (err) {
      console.log("Error in create new category:", err.message);
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          "شما دسترسی لازم برای ایجاد دسته بندی جدید رو ندارید .( باید حدالقل دسترسی categort.creat را داشته باشید)",
        );
      } else if (err.response?.status === 409) {
        setIsWarningOpen(true);
        setWarningMessage(
          "این دسته بندی قبلا ثبت شده است . از نام دیگری استفاده کنید",
        );
      } else {
        setWarningMessage("خطا در ایجاد دسته بندی. لطفا مجدد تلاش کنید");
        setIsWarningOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-6 bg-white">
          <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
            فرم اضافه کردن دسته بندی
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام دسته بندی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="نام..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                {...register("name", {
                  required: "نام دسته بندی الزامی است",
                  minLength: {
                    value: 2,
                    message: "نام دسته بندی حداقل باید ۲ کاراکتر باشد",
                  },
                  maxLength: {
                    value: 100,
                    message: "نام دسته بندی حداکثر ۱۰۰ کاراکتر می‌تواند باشد",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات دسته بندی
                <span className="text-gray-400 text-xs"> (اختیاری)</span>
              </label>
              <input
                type="text"
                placeholder="توضیحات..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                {...register("description", {
                  validate: (value) => {
                    if (!value || value.trim() === "") {
                      return true;
                    }
                    if (value.trim().length < 10)
                      return "توضیحات حداقل باید ۱۰ کاراکتر باشد";
                    if (value.trim().length > 500)
                      return "توضیحات حداکثر ۵۰۰ کاراکتر  باشد";
                    return true;
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لینک دسته بندی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="لینک..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 
                }`}
                value={watchSlug}
                onChange={handleSlugChange}
              />
              <input
                type="hidden"
                {...register("slug", {
                  required: "لینک دسته بندی الزامی است",
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message:
                      "فقط حروف کوچک انگلیسی، اعداد و خط تیره بین کلمات مجاز است ",
                  },
                })}
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug.message}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                فقط حروف کوچک انگلیسی، اعداد و خط تیره بین کلمات مجاز است
              </p>
            </div>

            <div className="flex-col gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register("ownership")}
                />
                <label className="block text-sm font-medium text-gray-700">
                  مالکیت (Ownership)
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                مالکیت اختیاری است و به صورت پیش فرض false است
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "در حال ارسال..." : "اضافه کردن دسته بندی"}
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          setSuccessMessage("");
        }}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => {
          setIsWarningOpen(false);
          setWarningMessage("");
        }}
        message={warningMessage}
      />
    </>
  );
};

export default ComponentAddCategory;
