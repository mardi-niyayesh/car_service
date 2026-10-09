import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { FiTrash } from "react-icons/fi";
import ComponentPaginat from "../../Paginate/ComponentPaginat";
import { MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type Car = {
  name: string;
  company: string;
  price_per_day: number;
  image: string;
  description: string;
  id?: string;
  slug: string;
};

export type CarRent = {
  id: string;
  price: number;
  status: string;
  start_date: string;
  end_date: string;
  cart_id: string;
  car: Car;
  total_price: number;
};

const BasketComponent = () => {
  const navigate = useNavigate();
  const [dataReserve, setDataReserve] = useState<CarRent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartId, setCartId] = useState<string | null>(null);

  const fetchAllReserve = async () => {
    try {
      const response = await axiosClient.get(
        `carts?page=${page}&limit=5&order=asc`,
      );
      const DataShop = response.data.response.data;
      const allReserve = DataShop.cart.carRents;
      const TotalPrice = DataShop.cart.total_price;
      const DataCount = DataShop.count;
      const calculatedTotalPages = Math.ceil(DataCount / 5);
      setTotalPages(calculatedTotalPages);

      const fetchedCartId = DataShop.cart.id || DataShop.cart.cart_id;
      setCartId(fetchedCartId);

      setDataReserve(allReserve);
      setCartTotal(TotalPrice);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReserve();
  }, [page]);

  if (loading) return <div>در حال بارگذاری سبد خرید...</div>;

  const handleDeletItemBasket = async (id: string) => {
    try {
      const resdeletItem = await axiosClient.delete(`/carts/${id}`);
      if (resdeletItem.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("ماشین مورد نظر با موفیت از سبد خرید شما حذف شد");
      }
      await fetchAllReserve();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 400) {
        setIsWarningOpen(true);
        setSuccessMessage(
          "ماشین مورد نظر در دیتابیس وجود ندارد لطفا صفحه را رفرش کنید",
        );
      } else {
        setIsWarningOpen(true);
        setWarningMessage(
          "خطایی در سرور رخ داده است لطفا لحاظاتی بعد دوباره تلاش کنید",
        );
      }
    }
  };

  const handlePaymentItem = async (id: string) => {
    try {
      const resPay = await axiosClient.post(`payments/${id}`);
      console.log("response to payment car :", resPay.data);

      if (resPay.data.success === true) {
        setIsSuccessOpen(true);
        setSuccessMessage("پرداخت با موفقیت انجام شد.");

        await fetchAllReserve();
        window.dispatchEvent(new Event("cart-updated"));

        // ✅ پس از ۲ ثانیه (برای دیدن مودال)، به صفحه تاریخچه برو
        setTimeout(() => {
          if (cartId) {
            navigate("/dashboard/card", { state: { cartId } });
          } else {
            console.warn("⚠️ cartId وجود ندارد، نمی‌توان به تاریخچه رفت.");
          }
        }, 2000);
      } else {
        setIsWarningOpen(true);
        setWarningMessage("پرداخت ناموفق بود لطفاً دوباره تلاش کنید.");
      }
    } catch (err: any) {
      console.error("Error in payment item:", err);
      const status = err.response?.status;

      if (status === 409) {
        setIsWarningOpen(true);
        setWarningMessage("این سفارش قبلا پرداخت شده است");
      } else if (status === 404) {
        setIsWarningOpen(true);
        setWarningMessage("سفارش مورد نظر یافت نشد. لطفاً صفحه را رفرش کنید.");
      } else {
        setIsWarningOpen(true);
        setWarningMessage(
          "خطایی در پرداخت رخ داده است. لطفاً چند لحظه بعد تلاش کنید.",
        );
      }
    }
  };
  const toPersianDigits = (num: number): string => {
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (d) => persian[parseInt(d)]);
  };

  return (
    <>
      <div dir="rtl" className="min-h-screen bg-gray-50/60 py-5 sm:py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
                سبد خرید
              </h1>

              <p className="mt-1 text-[11px] text-gray-500 sm:text-sm">
                خودروهای انتخاب‌شده برای رزرو
              </p>
            </div>

            {dataReserve.length > 0 && (
              <div className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm ring-1 ring-gray-100 sm:px-4 sm:py-2 sm:text-xs">
                {toPersianDigits(dataReserve.length)} خودرو
              </div>
            )}
          </div>

          {dataReserve.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 sm:min-h-[360px]">
              <div className="text-center">
                <h2 className="text-base font-bold text-gray-800 sm:text-lg">
                  سبد خرید شما خالی است
                </h2>

                <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                  هنوز ماشینی برای رزرو انتخاب نکرده‌اید.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="hidden border-b border-gray-100 bg-gray-50/70 px-5 py-3 text-xs font-medium text-gray-400 md:grid md:grid-cols-[minmax(0,1fr)_130px_130px_100px] md:items-center md:gap-4">
                  <span>خودرو</span>
                  <span className="text-center">تاریخ اجاره</span>
                  <span className="text-center">مبلغ</span>
                  <span className="text-center">عملیات</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {dataReserve.map((rent) => {
                    const start = +new Date(rent.start_date);
                    const end = +new Date(rent.end_date);

                    const diffTime = end - start;

                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );

                    return (
                      <div
                        key={rent.id}
                        className="
          p-3
          sm:p-4
          md:p-5
          transition-colors
          hover:bg-gray-50/60
        "
                      >
                        <div
                          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-[minmax(0,1fr)_150px_150px_100px]
            md:items-center
            md:gap-5
          "
                        >
                          <div
                            className="
              flex
              min-w-0
              items-center
              gap-3
              sm:gap-4
            "
                          >
                            <div
                              className="
                flex
                h-20
                w-24
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-gray-50
                sm:h-24
                sm:w-28
                md:h-24
                md:w-28
              "
                            >
                              <img
                                src={`/${rent.car.image}`}
                                alt={rent.car.name || "تصویر خودرو"}
                                className="
                  h-full
                  w-full
                  object-contain
                  p-2
                  transition-transform
                  duration-300
                  hover:scale-105
                "
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3
                                className="
                  truncate
                  text-sm
                  font-bold
                  text-gray-900
                  sm:text-base
                "
                              >
                                {rent.car.name}
                              </h3>

                              <p
                                className="
                  mt-1
                  truncate
                  text-xs
                  text-gray-500
                  sm:text-sm
                "
                              >
                                کمپانی : {rent.car.company}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                <span className="text-[15px] text-gray-500 ">
                                  روزانه
                                </span>

                                <span className="text-xs font-bold text-gray-700 sm:text-sm">
                                  {Number(
                                    rent.car.price_per_day,
                                  ).toLocaleString("fa-IR")}
                                </span>

                                <span className="text-[15px] text-gray-500">
                                  تومان
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="
              flex
              items-center
              justify-between
              rounded-xl
              bg-gray-50
              px-3
              py-3
              md:block
              md:bg-transparent
              md:p-0
              md:text-center
            "
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-gray-400 font-medium">
                                شروع اجاره
                              </span>

                              <span className="text-xs font-semibold text-gray-700">
                                {new Date(rent.start_date).toLocaleDateString(
                                  "fa-IR",
                                )}
                              </span>
                            </div>

                            <div
                              className="
                hidden
                text-gray-500
                md:block
                md:my-1
              "
                            >
                              ↓
                            </div>

                            <div className="flex flex-col gap-1 text-left md:text-center">
                              <span className="text-[10px] text-gray-400 font-medium">
                                پایان اجاره
                              </span>

                              <span className="text-xs font-semibold text-gray-700">
                                {new Date(rent.end_date).toLocaleDateString(
                                  "fa-IR",
                                )}
                              </span>
                            </div>
                          </div>

                          <div
                            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-yellow-100
              bg-yellow-50/50
              px-3
              py-3
              md:block
              md:border-0
              md:bg-transparent
              md:p-0
              md:text-center
            "
                          >
                            <div>
                              <span className="text-xs text-gray-500 md:hidden">
                                مبلغ کل
                              </span>

                              <p className="text-base font-extrabold text-gray-900 sm:text-lg">
                                {Number(rent.price).toLocaleString("fa-IR")}
                              </p>

                              <span className="text-[10px] text-gray-400 font-medium">
                                تومان
                              </span>
                            </div>
                          </div>

                          <div
                            className="
              grid
              grid-cols-2
              gap-2
              md:flex
              md:flex-col
              md:items-center
            "
                          >
                            <button
                              type="button"
                              onClick={() => handleDeletItemBasket(rent.id)}
                              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
                rounded-lg
                border
                border-red-200
                bg-red-500
                px-3
                text-xs
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-red-600
                active:scale-[0.98]
                md:h-8
                md:w-full
              "
                            >
                              <FiTrash size={13} />
                              حذف
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePaymentItem(rent.id)}
                              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-green-600
                px-3
                text-xs
                font-bold
                text-white
                transition-all
                duration-200
                hover:bg-green-700
                active:scale-[0.98]
                md:h-8
                md:w-full
              "
                            >
                              <MdPayment size={14} />
                              پرداخت
                            </button>
                          </div>
                        </div>

                        <div
                          className="
            mt-3
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            pt-3
            text-xs
          "
                        >
                          <span className="text-gray-500 text-[14px]">
                            مدت زمان اجاره
                          </span>

                          <span className="font-semibold text-gray-700">
                            {toPersianDigits(diffDays)} روز
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 px-3 py-3 sm:px-5">
                  <ComponentPaginat
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>

              <aside className="h-fit lg:sticky lg:top-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                      خلاصه سفارش
                    </h2>

                    <span className=" text-gray-400">
                      {toPersianDigits(dataReserve.length)} خودرو
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">تعداد خودرو</span>

                      <span className="font-semibold text-gray-800">
                        {toPersianDigits(dataReserve.length)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">مجموع رزرو</span>

                      <span className="font-semibold text-gray-800">
                        {Number(cartTotal).toLocaleString("fa-IR")}
                        <span className="mr-1 text-[10px] text-gray-400">
                          تومان
                        </span>
                      </span>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4">
                      <div className="flex items-end justify-between gap-2">
                        <span className="text-sm font-bold text-gray-700">
                          مبلغ نهایی
                        </span>

                        <div className="text-left">
                          <span className="text-lg font-extrabold text-gray-700 sm:text-xl">
                            {Number(cartTotal).toLocaleString("fa-IR")}
                          </span>

                          <span className="mr-1 text-[15px] text-gray-400">
                            تومان
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (dataReserve.length > 0) {
                          handlePaymentItem(dataReserve[0].id);
                        }
                      }}
                      className="
                      flex
                      min-h-11
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-yellow-500
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                      transition
                      active:scale-[0.98]
                      hover:bg-yellow-600
                      hover:shadow-md
                    "
                    >
                      <MdPayment size={18} />
                      ادامه و پرداخت
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[15px] leading-5 text-gray-500 ">
                    با ادامه پرداخت، اطلاعات رزرو شما ثبت خواهد شد.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

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

export default BasketComponent;
