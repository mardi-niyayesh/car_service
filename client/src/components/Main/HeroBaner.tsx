import { useState } from "react";
import DatePicker from "react-datepicker-jalali";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import WarningModal from "../../Modal/WarningModal ";
import axiosClient from "../../services/axiosClient";
import { toGregorian } from "jalaali-js";
import SuccessModal from "../../Modal/SuccessModal";
import { useNavigate } from "react-router-dom";

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const locale = {
  localize: {
    month: (n: number) => months[n],
    day: (n: number) => weekDays[n],
  },
  formatLong: {
    date: () => "yyyy/MM/dd",
  },
};

type FormData = {
  deliveryDate: Date | string | null;
  returnDate: Date | string | null;
  description: string;
};

const jalaliToGregorian = (jy: number, jm: number, jd: number) => {
  const result = toGregorian(jy, jm, jd);
  return { year: result.gy, month: result.gm, day: result.gd };
};

const toDateParts = (
  value: any,
): { year: number; month: number; day: number } | null => {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value.getTime())) {
    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    };
  }

  if (typeof value === "string") {
    let parts = value.split("-");
    if (parts.length !== 3) parts = value.split("/");
    if (parts.length === 3) {
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const d = parseInt(parts[2]);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        if (y >= 1300 && y <= 1499) {
          const gregorian = jalaliToGregorian(y, m, d);
          return gregorian;
        } else {
          return { year: y, month: m, day: d };
        }
      }
    }
  }

  return null;
};

const compareDateParts = (
  d1: { year: number; month: number; day: number },
  d2: { year: number; month: number; day: number },
): number => {
  if (d1.year !== d2.year) return d1.year - d2.year;
  if (d1.month !== d2.month) return d1.month - d2.month;
  return d1.day - d2.day;
};

const getTodayParts = (): { year: number; month: number; day: number } => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
};

const formatDateParts = (parts: {
  year: number;
  month: number;
  day: number;
}): string => {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
};

const HeroBaner = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isSuccessOpen, setISuccessOpen] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      deliveryDate: null,
      returnDate: null,
      description: "",
    },
  });

  const deliveryDate = watch("deliveryDate");
  const returnDate = watch("returnDate");

  const validateDeliveryDate = (value: Date | string | null) => {
    const selected = toDateParts(value);
    if (!selected) return "تاریخ تحویل الزامی است.";
    const today = getTodayParts();
    if (compareDateParts(selected, today) < 0) {
      return "تاریخ تحویل نمی‌تواند قبل از امروز باشد.";
    }
    return true;
  };

  const validateReturnDate = (value: Date | string | null) => {
    const selected = toDateParts(value);
    if (!selected) return "تاریخ بازگشت الزامی است.";

    const delivery = toDateParts(deliveryDate);
    if (delivery && compareDateParts(selected, delivery) <= 0) {
      return "تاریخ بازگشت باید بعد از تاریخ تحویل باشد.";
    }

    const today = getTodayParts();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxParts = toDateParts(maxDate);
    if (maxParts && compareDateParts(selected, maxParts) > 0) {
      return "مدت اجاره نمی‌تواند بیش از ۳۰ روز باشد.";
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setWarningMessage("برای ثبت رزرو ابتدا باید وارد حساب کاربری خود شوید.");
      setIsWarningOpen(true);
      return;
    }
    if (!slug) {
      setWarningMessage("شناسه ماشین مشخص نیست.");
      setIsWarningOpen(true);
      return;
    }

    const deliveryParts = toDateParts(data.deliveryDate);
    const returnParts = toDateParts(data.returnDate);
    if (!deliveryParts || !returnParts) {
      setWarningMessage("تاریخ‌های انتخاب شده معتبر نیستند.");
      setIsWarningOpen(true);
      return;
    }

    const start_date = formatDateParts(deliveryParts);
    const end_date = formatDateParts(returnParts);

    const requestBody = {
      car_slug: slug,
      description: data.description?.trim() || "بدون توضیحات",
      start_date,
      end_date,
    };

    console.log("Request Body:", requestBody);

    setIsLoading(true);
    try {
      const response = await axiosClient.post("/carts", requestBody);
      console.log("Success:", response.data);

      setISuccessOpen(true);
      setSuccessMessage("ماشین با موفقیت به سبد خرید اضافه شد!");
      setTimeout(() => {
        navigate("/basket");
      }, 3000);
    } catch (error: any) {
      console.error("Full error object:", error);
      let message = "مشکل در ارتباط با سرور. لطفاً مجدداً تلاش کنید.";
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        const serverMsg =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          JSON.stringify(errorData);
        if (status === 409) {
          message = `تداخل زمانی  با رزو کاربر دیگر`;
        } else if (status === 404) {
          message = `ماشین یافت نشد لطفا صفحه را رفرش کنید`;
        } else {
          message = serverMsg;
        }
      } else if (error.request) {
        message = "سرور پاسخ نمی‌دهد. لطفاً مجدداً تلاش کنید.";
      }
      setWarningMessage(message);
      setIsWarningOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container w-full bg-white rounded-lg shadow-md p-4 sm:p-6 mx-auto"
      >
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              تاریخ تحویل <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <FaCalendarAlt size={24} className="text-blue-800" />
                </div>
                <Controller
                  name="deliveryDate"
                  control={control}
                  rules={{ validate: validateDeliveryDate }}
                  render={({ field }) => (
                    <DatePicker
                      selected={
                        field.value
                          ? field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                          : null
                      }
                      onChange={(date: any) => field.onChange(date)}
                      placeholderText="انتخاب تاریخ تحویل"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      locale={locale}
                    />
                  )}
                />
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              تاریخ بازگشت <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <FaCalendarAlt size={24} className="text-blue-800" />
                </div>
                <Controller
                  name="returnDate"
                  control={control}
                  rules={{ validate: validateReturnDate }}
                  render={({ field }) => (
                    <DatePicker
                      selected={
                        field.value
                          ? field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                          : null
                      }
                      onChange={(date: any) => field.onChange(date)}
                      placeholderText="انتخاب تاریخ بازگشت"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      locale={locale}
                    />
                  )}
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.returnDate.message}
                  </p>
                )}
              </div>
            </div>
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
                minLength: { value: 5, message: "حداقل ۵ کاراکتر وارد کنید" },
                maxLength: {
                  value: 500,
                  message: "حداکثر ۵۰۰ کاراکتر مجاز است",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-yellow-500 w-full hover:bg-yellow-700 text-white p-3 rounded-lg font-medium flex items-center justify-center gap-1.5 m-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "در حال ثبت..." : "ثبت درخواست"}
        </button>

        <div className="mt-10 flex justify-end">
          <Link
            to="/"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            <span>انتقال به رزرو بعدی</span>
            <FiArrowLeft className="text-lg" />
          </Link>
        </div>
      </form>

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={warningMessage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setISuccessOpen(false)}
        message={SuccessMessage}
      />
    </div>
  );
};

export default HeroBaner;
