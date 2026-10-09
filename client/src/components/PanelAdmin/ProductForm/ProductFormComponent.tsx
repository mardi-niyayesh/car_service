
import { useForm, Controller } from "react-hook-form";
import TagInput from "./TagInput";
import { useEffect, useState } from "react";
import { useCategories } from "../../../hooks/useCategories";
import axiosClient from "../../../services/axiosClient";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";

type Count = {
  comments: number;
  users_favorites: number;
};

export type ProductFormType = {
  name: string;
  slug: string;
  company: string;
  price_per_day: number;
  tags: string[];
  description: string;
  can_rent: boolean;
  ownership?: boolean;
  category_id: string;
  id: string;
  image: string;
  rate: number;
  _count: Count;
};

type ProductFormProps = {
  mode: "create" | "update";
  defaultValues?: Partial<ProductFormType>;
  onSubmit: (data: ProductFormType) => void | Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
  productId?: string;
};

const ProductFormComponent = ({
  mode,
  defaultValues,
  onSubmit,
  submitButtonText,
  productId,
  isLoading = false,
}: ProductFormProps) => {
  const { categories } = useCategories();

  const [allcat, setAllcat] = useState(categories);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    reset,
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

  useEffect(() => {
    setAllcat(categories);
  }, [categories]);

  useEffect(() => {
    if (defaultValues) {
      reset({
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
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: ProductFormType) => {
    if (mode === "create" && !selectedImage) {
      setWarningMessage("لطفاً یک عکس برای محصول انتخاب کنید.");
      setIsWarningOpen(true);
      return;
    }

    if (!data.category_id) {
      setWarningMessage("لطفاً یک دسته‌بندی انتخاب کنید.");
      setIsWarningOpen(true);
      return;
    }

    const tagsArray = Array.isArray(data.tags)
      ? data.tags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const description = data.description?.trim() ?? "";

    const payload: Record<string, unknown> = {
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      company: data.company.trim(),
      price_per_day: Number(data.price_per_day),
      tags: tagsArray,
      can_rent: data.can_rent,
      ownership: data.ownership ?? false,
      category_id: data.category_id,
      description,
    };

    // در ویرایش، تنها ComponentUpdateProduct مسئول ارسال درخواست است.
    if (mode === "update") {
      await onSubmit({
        ...data,
        name: data.name.trim(),
        slug: data.slug.trim().toLowerCase(),
        company: data.company.trim(),
        price_per_day: Number(data.price_per_day),
        tags: tagsArray,
        description,
        can_rent: data.can_rent,
        ownership: data.ownership ?? false,
      });
      return;
    }

    try {
      const response = await axiosClient.post("/cars", payload);

      const createdProduct =
        response.data?.response?.data?.car ?? response.data?.data?.car;

      const createdProductId = createdProduct?.id;

      if (!createdProductId) {
        throw new Error("شناسه محصول در پاسخ سرور یافت نشد.");
      }

      let uploadedImageUrl: string | null = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const imageResponse = await axiosClient.post(
          `/cars/${createdProductId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const imageData =
          imageResponse.data?.response?.data ?? imageResponse.data?.data;

        uploadedImageUrl =
          imageData?.imageUrl ?? imageData?.url ?? null;
      }

      setSuccessMessage("محصول با موفقیت ساخته شد.");
      setIsSuccessOpen(true);
      setSelectedImage(null);
      setPreviewUrl(null);

      await onSubmit({
        ...createdProduct,
        id: createdProductId,
        image: uploadedImageUrl ?? createdProduct.image ?? "",
      });
    } catch (err: any) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      const errorText = Array.isArray(serverMessage)
        ? serverMessage.join(" ")
        : serverMessage || err.message || "خطای ناشناخته";

      if (status === 409) {
        setWarningMessage(errorText);
        setIsWarningOpen(true);
      } else if (status === 400 || status === 403 || status === 404) {
        setWarningMessage(errorText);
        setIsWarningOpen(true);
      } else {
        setErrorMessage(errorText);
        setIsErrorOpen(true);
      }
    }
  };

  return (
    <>
      <form
        className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="p-6 bg-white">
          <p className="text-yellow-500 text-[20px] font-bold mb-4">
            {mode === "create" ? "ساختن ماشین جدید" : "ویرایش ماشین"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                اسم ماشین
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                placeholder="عنوان..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                {...register("name", {
                  required: mode === "create" ? "نام الزامی است" : false,
                  minLength: { value: 2, message: "حداقل ۲ کاراکتر" },
                  maxLength: { value: 100, message: "حداکثر ۱۰۰ کاراکتر" },
                  pattern: {
                    value:
                      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹ _-]+$/,
                    message: "فرمت نام معتبر نیست",
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
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                توضیحات <span className="text-gray-400">(اختیاری)</span>
              </label>
              <input
                type="text"
                placeholder="توضیحات..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                {...register("description", {
                  minLength: { value: 5, message: "حداقل ۵ کاراکتر" },
                  maxLength: { value: 500, message: "حداکثر ۵۰۰ کاراکتر" },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                تگ‌ها
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Controller
                name="tags"
                control={control}
                rules={{
                  required: mode === "create" ? "حداقل یک تگ" : false,
                  validate: (value) => {
                    const tags = Array.isArray(value) ? value : [];
                    if (tags.length === 0) return "حداقل یک تگ وارد کنید";

                    const pattern =
                      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹_-]+$/;

                    for (const tag of tags) {
                      if (tag.length < 2 || tag.length > 50) {
                        return "هر تگ بین ۲ تا ۵۰ کاراکتر";
                      }
                      if (!pattern.test(tag)) return "فرمت تگ نامعتبر";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <TagInput
                    value={field.value || []}
                    onChange={(newTags) =>
                      field.onChange(Array.isArray(newTags) ? newTags : [])
                    }
                    placeholder="مثال: سدان, خانوادگی, کم مصرف"
                  />
                )}
              />
              {errors.tags && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                کمپانی
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                placeholder="کمپانی..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                  errors.company ? "border-red-500" : "border-gray-300"
                }`}
                {...register("company", {
                  required: mode === "create" ? "کمپانی الزامی است" : false,
                  minLength: { value: 2, message: "حداقل ۲ کاراکتر" },
                  maxLength: { value: 150, message: "حداکثر ۱۵۰ کاراکتر" },
                  pattern: {
                    value:
                      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹ _-]+$/,
                    message: "فرمت کمپانی نامعتبر",
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
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                لینک
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                placeholder="لینک..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                  errors.slug ? "border-red-500" : "border-gray-300"
                }`}
                {...register("slug", {
                  required: mode === "create" ? "لینک الزامی است" : false,
                  minLength: { value: 2, message: "حداقل ۲ کاراکتر" },
                  maxLength: { value: 150, message: "حداکثر ۱۵۰ کاراکتر" },
                  pattern: {
                    value: /^(?!.*--)(?!.*__)[a-z][a-z0-9_-]*$/,
                    message: "فرمت لینک نامعتبر (فقط حروف کوچک، اعداد، _ و -)",
                  },
                })}
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                قیمت روزانه
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="number"
                placeholder="قیمت..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                  errors.price_per_day ? "border-red-500" : "border-gray-300"
                }`}
                {...register("price_per_day", {
                  required: mode === "create" ? "قیمت الزامی است" : false,
                  min: { value: 0, message: "حداقل ۰" },
                  max: { value: 50000000, message: "حداکثر ۵۰,۰۰۰,۰۰۰" },
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
              <label className="block text-[18px] font-medium text-gray-700 mb-1">
                دسته‌بندی
                {mode === "create" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <select
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.category_id ? "border-red-500" : "border-gray-300"
                }`}
                {...register("category_id", {
                  required: mode === "create" ? "دسته‌بندی الزامی است" : false,
                })}
              >
                <option value="">انتخاب دسته‌بندی</option>
                {allcat.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                انتخاب عکس ماشین
                {mode === "create" && (
                  <span className="text-red-500 mr-2">*</span>
                )}
                {mode === "update" && (
                  <span className="text-gray-400 text-sm mr-2">(اختیاری)</span>
                )}
              </label>

              <input
                accept="image/jpeg, image/png, image/webp"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedImage(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full border border-gray-300 rounded-lg text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0"
              />

              <p className="text-gray-500 text-sm m-2">
                فرمت‌های مجاز: jpg, jpeg, png, webp
              </p>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">پیش‌نمایش:</p>
                  <img
                    src={previewUrl}
                    alt="پیش‌نمایش"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              {mode === "update" && defaultValues?.image && !previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">عکس فعلی:</p>
                  <img
                    src={defaultValues.image}
                    alt="عکس فعلی"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 pb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded"
                {...register("can_rent")}
              />
              <label className="text-[18px] font-medium text-gray-700">
                قابل اجاره است؟
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded"
                {...register("ownership")}
              />
              <label className="text-[18px] text-gray-700">
                مالکیت (Ownership)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (mode === "create" && !selectedImage)}
            className="py-3 px-4 mt-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ارسال..." : submitButtonText}
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
        message={warningMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errorMessage}
      />
    </>
  );
};

export default ProductFormComponent;
