import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { FiTrash } from "react-icons/fi";
import ComponentPaginat from "../../Paginate/ComponentPaginat";

export type Car = {
  name: string;
  company: string;
  price_per_day: number;
  image: string;
  description: string;
  id?: string;
};

export type CarRent = {
  id: string;
  price: number;
  status: string;
  start_date: string;
  end_date: string;
  car: Car;
  total_price: number;
};

const BasketComponent = () => {
  const [dataReserve, setDataReserve] = useState<CarRent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllReserve = async () => {
    try {
      const response = await axiosClient.get(
        `carts?page=${page}&limit=1&order=asc`,
      );
      const DataShop = response.data.response.data;
      const allReserve = DataShop.cart.carRents;
      const TotalPrice = DataShop.cart.total_price;
      const DataCount = DataShop.count;
      const calculatedTotalPages = Math.ceil(DataCount / 1);
      setTotalPages(calculatedTotalPages);

      setDataReserve(allReserve);
      setCartTotal(TotalPrice);
    } catch (err) {
      console.log("Error in get basket :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReserve();
  }, [page]);

  if (loading) return <div>در حال بارگذاری سبد خرید...</div>;

  const handleBillReserev = () => {
    setIsSuccessOpen(true);
    setSuccessMessage(`پرداخت شما با موفقیت انجام شد خودرو ی شما آماده ی تحویل می باشد و
        کارشناسان ما در کمترین زمان ممکن جهت پیگیری سفارش شما با شما تماس خواهند
        گرفت`);
  };

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
      console.log("Error in deleat car ", err);
      if (err.response?.status === 400) {
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
  const toPersianDigits = (num: number): string => {
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (d) => persian[parseInt(d)]);
  };

  return (
    <>
      <div className=" border border-[#EDEDED] rounded-xl bg-yellow-100 shadow-sm sm:gap-0 p-2 sm:p-3  ">
        <h2 className="text-yellow-500 text-[30px]  text-center">سبد خرید</h2>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {dataReserve.length === 0 ? (
          <p className="bg-amber-100 text-center rounded  mt-3">
            سبد خرید خالی است
          </p>
        ) : (
          <>
            {dataReserve.map((rent) => (
              <div
                key={rent.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row gap-4 p-4 border border-gray-100"
              >
                <div className="flex-shrink-0 flex justify-center">
                  <img
                    src={`/${rent.car.image}`}
                    alt={rent.car.name || "تصویر خودرو"}
                    className="w-32 h-32 object-cover rounded-lg sm:w-28 sm:h-28"
                  />
                </div>
                <div className="flex-1 space-y-1 text-right">
                  <p className="text-lg font-bold text-gray-800">
                    قیمت کل اجاره: {rent.price} تومان
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">خودرو:</span>
                    {rent.car.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">شرکت:</span>
                    {rent.car.company}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">قیمت روزانه:</span>
                    {Number(rent.car.price_per_day).toLocaleString("fa-IR")}
                    تومان
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">تاریخ شروع:</span>
                    {new Date(rent.start_date).toLocaleDateString("fa-IR")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">تاریخ پایان:</span>
                    {new Date(rent.end_date).toLocaleDateString("fa-IR")}
                  </p>

                  <div className=" md:text-[18px] ">
                    <span className="text-gray-600 ml-1">مدت زمان اجاره :</span>
                    <span className="text-[#494949]">
                      {(() => {
                        const start = +new Date(rent.start_date);
                        const end = +new Date(rent.end_date);
                        const diffTime = end - start;
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24),
                        );
                        return `${toPersianDigits(diffDays)} روز`;
                      })()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletItemBasket(rent.id)}
                    className=" mt-4 border-2 flex items-center border-red-500 text-red-600 hover:bg-red-500 hover:text-white  px-2 rounded-lg transition"
                  >
                    <FiTrash className="" /> حذف
                  </button>
                </div>
              </div>
            ))}
            <ComponentPaginat
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />

            <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-gray-800">
                  جمع کل پرداختی:
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cartTotal} تومان
                </p>
              </div>

              <button
                onClick={handleBillReserev}
                className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
              >
                پرداخت نهایی
              </button>
            </div>
          </>
        )}
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
