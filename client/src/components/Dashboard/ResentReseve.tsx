import axiosClient from "../../services/axiosClient";
import { useEffect } from "react";
import { useState } from "react";
import { type CarRent } from "../Basket/BasketComponent";
const ResentReseve = () => {
  const [Databasket, setDatabasket] = useState<CarRent[]>([]);
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const resBasket = await axiosClient.get(`/carts`);
        const GetDataBasket = resBasket.data.response.data.cart.carRents;

        console.log(GetDataBasket);
        setDatabasket(GetDataBasket);
      } catch (err) {
        console.log("Error in get all reserve :", err);
      }
    };

    fetchBasket();
  }, []);

  if (!Databasket.length)
    return (
      <div className="bg-amber-100 text-center rounded  mt-3">
        سبد خرید خالی است...!
      </div>
    );
  const toPersianDigits = (num: number): string => {
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (d) => persian[parseInt(d)]);
  };

  return (
    <div>
      {Databasket?.map((data) => (
        <div key={data.id} className="mt-4 border-b py-3.5 border-gray-300 w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 ">
                  <img
                    src={`/${data.car.image}`}
                    alt="carimg"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-gray-600 ml-1 text-[18px]">اسم ماشین :</span>
                  <span className="text-[#353535] font-medium text-[14px] md:text-[16px]">
                    {data.car.name}
                  </span>

                  <div className=" flex-wrap gap-4">
                    <div className=" md:text-[17px]">
                      <span className="text-gray-600 ml-1">
                        تاریخ شروع اجاره :
                      </span>
                      <span className="text-[#494949]">
                        {new Date(data.start_date).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <div className=" md:text-[18px] ">
                      <span className="text-gray-600 ml-1">
                        تاریخ پابان اجاره :
                      </span>
                      <span className="text-[#494949]">
                        {new Date(data.end_date).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <div className=" md:text-[18px] ">
                      <span className="text-gray-600 ml-1">
                        مدت زمان اجاره :
                      </span>
                      <span className="text-[#494949]">
                        {(() => {
                          const start = +new Date(data.start_date);
                          const end = +new Date(data.end_date);
                          const diffTime = end - start;
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );
                          return `${toPersianDigits(diffDays)} روز`;
                        })()}
                      </span>
                    </div>
                  </div>

                  <div>
                    {data.status === "PENDING" ? (
                      <span className="inline-block px-2  bg-amber-100 text-amber-700 text-[18px] md:text-[14px] font-bold rounded-lg">
                        در حال پرداخت
                      </span>
                    ) : (
                      <span className="inline-block px-4  bg-[#269E22]/10 text-[#269E22] text-[13px] md:text-[14px] font-bold rounded-lg">
                        پرداخت شده
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResentReseve;
