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

    setIsLoading(true);
    try {
      await axiosClient.post("/carts", requestBody);
   
      setISuccessOpen(true);
      setSuccessMessage("ماشین با موفقیت به سبد خرید اضافه شد!");
      setTimeout(() => {
        navigate("/basket");
      }, 3000);
    } catch (error: any) {
     
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
    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 transition-all"
      >
        <div className="space-y-5 md:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              تاریخ تحویل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none z-10">
                <FaCalendarAlt className="text-yellow-500 text-xl sm:text-2xl" />
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
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.deliveryDate
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                    locale={locale}
                  />
                )}
              />
              {errors.deliveryDate && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 mr-1">
                  {errors.deliveryDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              تاریخ بازگشت <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none z-10">
                <FaCalendarAlt className="text-yellow-500 text-xl sm:text-2xl" />
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
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.returnDate
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                    locale={locale}
                  />
                )}
              />
              {errors.returnDate && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 mr-1">
                  {errors.returnDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              توضیحات ماشین{" "}
              <span className="text-gray-400 font-normal text-xs sm:text-sm">
                (اختیاری)
              </span>
            </label>
            <input
              type="text"
              placeholder="توضیحات خود را وارد کنید..."
              className={`w-full px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base ${
                errors.description
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-300"
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
              <p className="text-red-500 text-xs sm:text-sm mt-1 mr-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold text-sm sm:text-base py-3 sm:py-3.5 px-4 rounded-xl mt-6 md:mt-8 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              در حال ثبت...
            </span>
          ) : (
            "ثبت درخواست"
          )}
        </button>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium text-sm sm:text-base transition-colors duration-200 group"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              انتقال به رزرو بعدی
            </span>
            <FiArrowLeft className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform duration-200" />
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
