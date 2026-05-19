import { useForm, Controller } from "react-hook-form";
import TagInput from "./TagInput";
import { Link } from "react-router-dom";

export type ProductFormType = {
  name: string;
  slug: string;
  company: string;
  price_per_day: number;
  tags: string[];
  description: string;
  can_rent: boolean;
  ownership: boolean;
  category_id: string;
};

type ProductFormProps = {
  mode: "create" | "update";
  defaultValues?: Partial<ProductFormType>;
  onSubmit: (data: ProductFormType) => void | Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
};

const ProductFormComponent = ({
  mode,
  defaultValues,
  onSubmit,
  submitButtonText,
  isLoading = false,
}: ProductFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormType>({
    defaultValues: {
      name: "",
      slug: "",
      company: "",
      price_per_day: 0,
      tags: [],
      description: "",
      can_rent: true,
      ownership: false,
      category_id: "",
      ...defaultValues,
    },
  });

  return (
    <form
      className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6 bg-white">
        <p className="text-[#4b33b5] text-[20px] font-bold mb-4">
          {mode === "create" ? "ساختن ماشین جدید " : "ویرایش ماشین"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم ماشین
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="عنوان..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required: mode === "create" ? "نام ماشین الزامی است" : false,
                minLength: {
                  value: 2,
                  message: "نام باید حداقل 2 کاراکتر باشد",
                },
                maxLength: {
                  value: 100,
                  message: "نام حداکثر 100 کاراکتر می‌باشد",
                },
                pattern: {
                  value:
                    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹ _-]+$/,
                  message:
                    "فقط حروف فارسی و انگلیسی، اعداد (۰-۹ و 0-9)، فاصله، خط تیره (-) و زیرخط (_) مجاز است.",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات ماشین <span className="text-gray-400">(اختیاری)</span>
            </label>
            <input
              type="text"
              placeholder="توضیحات..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description", {
                minLength: {
                  value: 5,
                  message: "توضیحات حداقل باید 5 کاراکتر باشد",
                },
                maxLength: {
                  value: 500,
                  message: "توضیحات حداکثر 500 کاراکتر می باشد",
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
              تگ‌ها
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <Controller
              name="tags"
              control={control}
              rules={{
                required: mode === "create" ? "حداقل یک تگ وارد کنید" : false,

                validate: (value) =>
                  (value && value.length >= 1) || "حداقل یک تگ الزامی است",
              }}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="مثال: سدان, خانوادگی, کم مصرف"
                />
              )}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کمپانی ماشین
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="کمپانی..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.company ? "border-red-500" : "border-gray-300"
              }`}
              {...register("company", {
                required:
                  mode === "create" ? "داشتن نام کمپانی الزامی است" : false,
                minLength: {
                  value: 2,
                  message: "کمپانی باید حداقل 2 کاراکتر داشته باشد",
                },
                maxLength: {
                  value: 150,
                  message: "کمپانی حداکثر 150 کاراکتر می‌تواند داشته باشد",
                },
                pattern: {
                  value:
                    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹ _-]+$/,
                  message:
                    "فقط حروف فارسی و انگلیسی، اعداد (۰-۹ و 0-9)، فاصله، زیرخط (_) و خط تیره (-) مجاز است",
                },
              })}
            />
            {errors.company && (
              <p className="text-red-500 text-xs mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              لینک ماشین
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="لینک..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.slug ? "border-red-500" : "border-gray-300"
              }`}
              {...register("slug", {
                required: mode === "create" ? "داشتن لینک الزامی است" : false,

                minLength: {
                  value: 2,
                  message: "لینک باید حداقل 2 کاراکتر داشته باشد",
                },
                maxLength: {
                  value: 150,
                  message: "لینک حداکثر 150 کاراکتر می‌تواند داشته باشد",
                },
                pattern: {
                  value: /^(?!.*--)(?!.*__)[a-z][a-z0-9_-]*$/,
                  message:
                    "باید با حرف کوچک انگلیسی شروع شود، فقط شامل حروف کوچک، اعداد، زیرخط (_) و خط تیره (-) باشد، و نباید دارای دو خط تیره یا دو زیرخط پشت‌سرهم باشد.",
                },
              })}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              قیمت ماشین
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="number"
              placeholder="قیمت..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.price_per_day ? "border-red-500" : "border-gray-300"
              }`}
              {...register("price_per_day", {
                required: mode === "create" ? "هزینه الزامی است" : false,
                min: {
                  value: 0,
                  message: "هزینه حداقل 0 تومان باشد",
                },
                max: {
                  value: 50000000,
                  message: "هزینه حداکثر 50,000,000 تومان می‌تواند باشد",
                },
                valueAsNumber: true,
              })}
            />
            {errors.price_per_day && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price_per_day.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آیدی دسته بندی ماشین
              {mode === "create" ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              )}
            </label>
            <input
              type="text"
              placeholder="آیدی دسته بندی..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.category_id ? "border-red-500" : "border-gray-300"
              }`}
              {...register("category_id", {
                required:
                  mode === "create" ? "آیدی دسته بندی الزامی است" : false,
                pattern: {
                  value:
                    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/,
                  message: "فرمت UUID معتبر نیست (36 کاراکتر با خط تیره)",
                },
              })}
            />
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آپلود عکس ماشین
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register("can_rent")}
              defaultChecked={true}
            />
            <label className="block text-sm font-medium text-gray-700">
              آیا ماشین قابل اجاره است؟
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register("ownership")}
            />
            <label className="block text-sm font-medium text-gray-700">
              مالکیت (Ownership)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? "در حال ارسال..." : submitButtonText}
        </button>
      </div>
      <Link to="/panel/category">
        <p className="text-blue-600 mb-3 hover:text-blue-800 font-medium">
          برای دیدن ایدی دسته بندی ها کلیک کنید
        </p>
      </Link>
    </form>
  );
};

export default ProductFormComponent;
