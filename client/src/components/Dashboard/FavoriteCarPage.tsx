import axiosClient from "../../services/axiosClient";
import { useState, useEffect } from "react";
import { type Car } from "../Basket/BasketComponent";
import ComponentPaginat from "../../Paginate/ComponentPaginat";
import { useCallback } from "react";
import { Link } from "react-router-dom";

type FavoriteCarTipe = {
  id: string;
  car: Car;

};

const FavoriteCarPage = () => {
  const [favoriteCar, setFavoriteCar] = useState<FavoriteCarTipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  

  const GetAllFavorit = useCallback(async () => {
    const response = await axiosClient.get(
      `favorites?page=${page}&limit=5&order=desc`,
    );
    const DataCar = response.data.response.data;
    const DataCount = DataCar.count;
    const calculatedTotalPages = Math.ceil(DataCount / 5);
    setTotalPages(calculatedTotalPages);

    const favoritesArray = DataCar?.favorites || [];

    setFavoriteCar(favoritesArray);
  }, [page]);

  useEffect(() => {
    GetAllFavorit();
  }, [page, GetAllFavorit]);

  return (
    <>
      <div className="space-y-4" dir="rtl">
        <div className="relative mb-5 overflow-hidden px-3 py-2 sm:px-4 sm:py-3">
          <div className="absolute right-0 top-1 bottom-1 w-1 rounded-full bg-yellow-400" />

          <div className="flex min-w-0 items-center justify-between gap-3 pr-3 sm:pr-4">
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-gray-800 sm:text-xl">
                علاقه‌مندی‌های من
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 text-[14px]">
                خودروهای ذخیره‌شده شما:
                <span className="font-bold text-yellow-600">
                  {favoriteCar.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {favoriteCar.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center  px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full  text-2xl">
              ♡
            </div>

            <p className="font-bold text-gray-700">
              هنوز خودرویی به علاقه‌مندی‌ها اضافه نکرده‌اید :( 
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favoriteCar.map((favorit) => (
              <div
                key={favorit.id}
                className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        
        hover:shadow-lg
      "
              >
                <div className="relative h-52 w-full overflow-hidden bg-gray-50">
                  <img
                    src={`/${favorit.car.image}`}
                    alt={favorit.car.name || "تصویر خودرو"}
                    className="
            h-full
            w-full
            object-contain
            p-5
            transition-transform
            duration-500
            group-hover:scale-105
          "
                  />
                </div>

                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                      {favorit.car.name}
                    </h3>

                    <span className="shrink-0 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                      {favorit.car.company}
                    </span>
                  </div>

                  <div className="space-y-3 rounded-xl bg-gray-50/80 p-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-500">شرکت</span>

                      <span className="font-semibold text-gray-800">
                        {favorit.car.company}
                      </span>
                    </div>

                    <div className="h-px bg-gray-200/70" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-500">قیمت روزانه</span>

                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-[#05164D]">
                          {Number(favorit.car.price_per_day).toLocaleString(
                            "fa-IR",
                          )}
                        </span>

                        <span className="text-xs text-gray-400">تومان</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[13px] text-gray-400 font-medium">
                      خودروی مورد علاقه شما
                    </span>

                    <Link to={`/detailcar/${favorit.car.slug}`}>
                      <button
                        type="button"
                        className="
              rounded-lg
              border
              border-gray-200
              px-3
              py-1.5
              text-xs
              font-semibold
              text-gray-600
              transition-all
              duration-200
              hover:border-yellow-400
              hover:bg-yellow-50
              hover:text-yellow-700
              active:border-yellow-400
              active:bg-yellow-50
              active:text-yellow-700
            "
                      >
                        مشاهده خودرو
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
