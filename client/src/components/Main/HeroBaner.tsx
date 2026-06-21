import { useState } from "react";
import DatePicker from "react-datepicker-jalali";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import WarningModal from "../../Modal/WarningModal ";

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

const HeroBaner = () => {
  const { user } = useUser();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deliveryDate: null,
      returnDate: null,
      description: "",
    },
  });
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const onsubmit = () => {
    if (!user) {
      setWarningMessage("برای ثبت رزرو ابتدا باید وارد حساب کاربری خود شوید.");
      setIsWarningOpen(true);
      return;
    }
  };

  return (
    <div>
      <div className=" px-4">
        <form
          onSubmit={handleSubmit(onsubmit)}
          className=" container w-full bg-white rounded-lg shadow-md p-4 sm:p-6 mx-auto"
        >
          <div className="grid grid-cols-1  gap-4 mb-6 ">
            <div className="col-span-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                تاریخ تحویل<span className="text-red-600">*</span>
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 right-0  flex items-center  pr-4">
                    <FaCalendarAlt size={24} className="text-blue-800 " />
                  </div>
                  <div className="relative">
                    <DatePicker
                      selected={returnDate}
                      onChange={(date: Date | null) => setDeliveryDate(date)}
                      placeholder="انتخاب تاریخ"
                      className="px-4 py-2 border ... w-full pr-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                تاریخ بازگشت<span className="text-red-600">*</span>
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 right-0  flex items-center   pr-4">
                    <FaCalendarAlt size={24} className="text-blue-800 " />
                  </div>

                  <div className="relative">
                    <DatePicker
                      selected={returnDate}
                      onChange={(date: Date | null) => setDeliveryDate(date)}
                      placeholder="انتخاب تاریخ"
                      className="px-4 py-2 border ... w-full pr-10"
                    />
                  </div>
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
                  minLength: {
                    value: 5,
                    message: "حدالقل 5 کاراکتر",
                  },
                  maxLength: {
                    value: 500,
                    message: "حدالکثر 500 کاراکتر",
                  },
                })}
              />
            </div>
          </div>

          <button className="bg-yellow-500 w-full hover:bg-yellow-700  text-center text-white p-3 rounded-lg font-medium flex items-center justify-center gap-1.5 m-auto">
            ثبت درخواست
          </button>
          <div className="flex">
            <div className="mt-10 flex justify-end">
              <Link
                to="/"
                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-semibold  "
              >
                <span>انتقال به رزرو بعدی</span>
                <FiArrowLeft className="text-lg" />
              </Link>
            </div>
          </div>
        </form>
      </div>

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={warningMessage}
      />
    </div>
  );
};

export default HeroBaner;
