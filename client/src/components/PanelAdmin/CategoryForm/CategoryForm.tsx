import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

export type CategoryFormData = {
  name: string;
  description: string;
  slug: string;
  ownership?: boolean;
};

type CategoryFormProps = {
  mode: "create" | "update";
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
};

const CategoryForm = ({
  mode,
  defaultValues = {
    name: "",
    description: "",
    slug: "",
    ownership: false,
  },
  onSubmit,
  isLoading,
  submitButtonText,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: defaultValues as CategoryFormData,
  });

  const watchSlug = watch("slug");

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = String(e.target.value);
    value = value.toLowerCase();
    value = value.replace(/[^a-z0-9-]/g, "");
    value = value.replace(/-+/g, "-");
    value = value.replace(/^-|-$/g, "");
    setValue("slug", value, { shouldValidate: true });
  };

  const prevDefaultValuesRef = useRef<string>();

  useEffect(() => {
    if (!defaultValues) return;
    const current = JSON.stringify(defaultValues);
    if (prevDefaultValuesRef.current !== current) {
      prevDefaultValuesRef.current = current;
      reset(defaultValues as CategoryFormData);
    }
  }, [defaultValues, reset]);

  return (
    <form
      className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6 bg-white">
        <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
          {mode === "create" ? "ایجاد دسته بندی " : "ویرایش دسته بندی"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام دسته بندی
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="نام..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required:
                  mode === "create" ? "نام دسته بندی الزامی است" : false,
                validate: (value) => {
                  if (mode === "update" && (!value || value.trim() === "")) {
                    return true;
                  }

                  if (value && value.trim().length < 2) {
                    return "نام دسته بندی حداقل باید ۲ کاراکتر باشد";
                  }
                  if (value && value.trim().length > 100) {
                    return "نام دسته بندی حداکثر ۱۰۰ کاراکتر می‌تواند باشد";
                  }
                  return true;
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
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
                  if (!value || value.trim() === "") return true;
                  if (value.trim().length < 10)
                    return "توضیحات حداقل باید ۱۰ کاراکتر باشد";
                  if (value.trim().length > 500)
                    return "توضیحات حداکثر ۵۰۰ کاراکتر باشد";
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
              لینک دسته بندی
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="لینک..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              value={watchSlug}
              onChange={handleSlugChange}
            />
            <input
              type="hidden"
              {...register("slug", {
                required:
                  mode === "create" ? "لینک دسته بندی الزامی است" : false,
                validate: (value) => {
                  if (mode === "update" && (!value || value.trim() === "")) {
                    return true;
                  }
                  if (value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
                    return "فقط حروف کوچک انگلیسی، اعداد و خط تیره بین کلمات مجاز است";
                  }
                  return true;
                },
              })}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              فقط حروف کوچک انگلیسی، اعداد و خط تیره بین کلمات مجاز است
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...register("ownership")}
          />
          <label className="block text-sm font-medium text-gray-700">
            مالکیت (Ownership)
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "در حال ارسال..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
