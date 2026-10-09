import { useParams } from "react-router-dom";
import { FaCarSide } from "react-icons/fa";
import GetAllProduct from "./GetAllProduct";
import { useProduct } from "../../hooks/useProduct";
import { useCategories } from "../../hooks/useCategories";

const ProductComponent = () => {
  const { allProduct, loading: productLoading } = useProduct();
  const { categories, loading: categoryLoading } = useCategories();
  const { slug } = useParams();

  if (productLoading || categoryLoading) {
    return (
      <section className="w-full px-4 py-16">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FDB713]" />

            <p className="text-sm font-medium text-gray-500">
              در حال بارگذاری محصولات...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const findCat = categories.find((cat) => cat.slug === slug);

  if (!findCat) {
    return (
      <section className="w-full px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
            <FaCarSide className="text-xl text-[#FDB713]" />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            دسته‌بندی مورد نظر یافت نشد
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            ممکن است این دسته‌بندی حذف شده باشد یا آدرس آن اشتباه باشد.
          </p>
        </div>
      </section>
    );
  }

  const categoryName = findCat.name;
  const categoryId = findCat.id;

  const filteredProducts = allProduct.filter(
    (product) => product.category_id === categoryId,
  );

  if (filteredProducts.length === 0) {
    return (
      <section className="w-full px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <FaCarSide className="text-xl text-gray-400" />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            محصولی در این دسته‌بندی وجود ندارد
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            در حال حاضر خودرویی برای دسته‌بندی «{categoryName}» ثبت نشده است.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-[#FDB713] sm:w-12" />

              <FaCarSide className="text-lg text-[#FDB713]" />

              <span className="h-px w-8 bg-[#FDB713] sm:w-12" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              {categoryName}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              خودروهای موجود در دسته‌بندی {categoryName}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
              <span className="text-xs text-gray-500 sm:text-sm">
                تعداد خودروها
              </span>

              <span className="text-sm font-bold text-[#05164D]">
                {filteredProducts.length}
              </span>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            sm:gap-5
            lg:grid-cols-3
            lg:gap-5
            xl:grid-cols-4
            xl:gap-6
          "
        >
          {filteredProducts.map((product) => (
            <GetAllProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductComponent;
