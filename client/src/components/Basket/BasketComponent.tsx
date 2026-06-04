import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import SuccessModal from "../../Modal/SuccessModal";

type Car = {
  name: string;
  company: string;
  price_per_day: number;
  image: string;
  description: string;
};

type CarRent = {
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

  useEffect(() => {
    const fetchAllReserve = async () => {
      try {
        const response = await axiosClient.get(`/carts`);

        const allReserve = response.data.response.data.cart.carRents;
        setDataReserve(allReserve);
        // console.log("All reserve to Basket :", allReserve);

        const TotalPrice = response.data.response.data.cart.total_price;
        setCartTotal(TotalPrice);
      } catch (err) {
        console.log("Error in get basket :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReserve();
  }, []);

  if (loading) return <div>در حال بارگذاری سبد خرید...</div>;
  const handleBillReserev = () => {
    setIsSuccessOpen(true);
    setSuccessMessage(`پرداخت شما با موفقیت انجام شد خودرو ی شما آماده ی تحویل می باشد و
        کارشناسان ما در کمترین زمان ممکن جهت پیگیری سفارش شما با شما تماس خواهند
        گرفت`);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {dataReserve.length === 0 ? (
          <p className="text-center text-gray-500 py-8">سبد خرید خالی است</p>
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
                    <span className="font-semibold">خودرو:</span>{" "}
                    {rent.car.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">شرکت:</span>{" "}
                    {rent.car.company}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">قیمت روزانه:</span>{" "}
                    {rent.car.price_per_day} تومان
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">تاریخ شروع:</span>{" "}
                    {new Date(rent.start_date).toLocaleDateString("fa-IR")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">تاریخ پایان:</span>{" "}
                    {new Date(rent.end_date).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-gray-800">
                  جمع کل پرداختی:
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {cartTotal} تومان
                </p>
              </div>

              <button
                onClick={handleBillReserev}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
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
    </>
  );
};

export default BasketComponent;
