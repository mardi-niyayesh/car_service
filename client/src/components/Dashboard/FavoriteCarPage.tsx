import axiosClient from "../../services/axiosClient";
import { useState, useEffect } from "react";
import { type Car } from "../Basket/BasketComponent";
import ComponentPaginat from "../../Paginate/ComponentPaginat";
import { useCallback } from "react";

type FavoriteCarTipe = {
  id: string;
  car: Car;
};

const FavoriteCarPage = () => {
  const [favoriteCar, setFavoriteCar] = useState<FavoriteCarTipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const GetAllFavorit = useCallback(async () => {
    try {
      const response = await axiosClient.get(
        `favorites?page=${page}&limit=5&order=desc`,
      );
      const DataCar = response.data.response.data;
      const DataCount = DataCar.count;
      const calculatedTotalPages = Math.ceil(DataCount / 5);
      setTotalPages(calculatedTotalPages);

      const favoritesArray = DataCar?.favorites || [];
      console.log("response all favorite :", favoritesArray);
      setFavoriteCar(favoritesArray);
    } catch (err) {
      console.log("Error in get all list favorite:", err);
    }
  }, [page]);

  useEffect(() => {
    GetAllFavorit();
  }, [page, GetAllFavorit]);

  return (
    <>
      <div>
        <div className=" border border-[#EDEDED] rounded-xl bg-yellow-100 shadow-sm sm:gap-0 p-3 sm:p-4 mb-3 ">
          <p className="text-yellow-800 text-[22px] font-bold  text-center ">
            علاقه مندی های من
          </p>
        </div>
        {favoriteCar.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            هیچ خودرویی در علاقه‌مندی‌ها یافت نشد.
          </p>
        ) : (
          favoriteCar.map((favorit) => (
            <div
              key={favorit.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row gap-4 p-4 border border-gray-100"
            >
              <div className="flex-shrink-0 flex justify-center">
                <img
                  src={`/${favorit.car.image}`}
                  alt={favorit.car.name || "تصویر خودرو"}
                  className="w-32 h-32 object-cover rounded-lg sm:w-28 sm:h-28"
                />
              </div>
              <div className="flex-1 space-y-1 text-right">
                <p className="text-gray-600">
                  <span>خودرو:</span>
                  {favorit.car.name}
                </p>
                <p className="text-gray-600">
                  <span>شرکت:</span>
                  {favorit.car.company}
                </p>
                <p className="text-gray-600">
                  <span>قیمت روزانه:</span>
                  {Number(favorit.car.price_per_day).toLocaleString("fa-IR")}
                  تومان
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <ComponentPaginat
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default FavoriteCarPage;
