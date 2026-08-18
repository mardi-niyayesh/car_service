import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCarSide,
  FaBuilding,
  FaTags,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

const Des3Car = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();

  const findProduct = allProduct.find((pro) => pro.slug === slug);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="border-b border-gray-100 bg-gradient-to-l from-gray-50 to-white px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                درباره ماشین
              </h2>

              <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
                اطلاعات و مشخصات خودرو
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <div className="mb-6 rounded-2xl bg-gray-50 p-4 sm:p-5">
            <p className="text-sm leading-7 text-gray-600 sm:text-[15px]">
              {findProduct?.description ||
                "توضیحاتی برای این خودرو ثبت نشده است."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FaMoneyBillWave size={15} />
                </div>

                <span className="text-sm text-gray-500">قیمت روزانه</span>
              </div>

              <span className="text-sm font-bold text-[#05164D]">
                {findProduct?.price_per_day} تومان
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaBuilding size={14} />
                </div>

                <span className="text-sm text-gray-500">کمپانی</span>
              </div>

              <span className="max-w-[55%] truncate text-sm font-semibold text-gray-800">
                {findProduct?.company || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaCarSide size={15} />
                </div>

                <span className="text-sm text-gray-500">دسته‌بندی</span>
              </div>

              <span className="text-sm font-semibold text-gray-800">
                {findProduct?.category?.name || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <FaCalendarAlt size={14} />
                </div>

                <span className="text-sm text-gray-500">تاریخ ایجاد</span>
              </div>

              <span className="text-sm font-semibold text-gray-800">
                {new Date(
                  findProduct?.created_at ?? new Date(),
                ).toLocaleDateString("fa-IR")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <FaClock size={14} />
                </div>

                <span className="text-sm text-gray-500">آخرین بروزرسانی</span>
              </div>

              <span className="text-sm font-semibold text-gray-800">
                {new Date(
                  findProduct?.updated_at ?? new Date(),
                ).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <FaTags className="text-gray-500" size={14} />

              <span className="text-sm font-semibold text-gray-700">
                تگ‌های خودرو
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {findProduct?.tags?.length ? (
                findProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">تگی ثبت نشده است</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Des3Car;
