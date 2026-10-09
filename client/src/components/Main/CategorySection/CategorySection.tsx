import { type CategoryType } from "../../../hooks/useCategories";
import { useProduct } from "../../../hooks/useProduct";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import GetAllProduct from "../../Product/GetAllProduct";
import { Link } from "react-router-dom";

type CategorySectionProps = {
  category: CategoryType;
};

const CategorySection = ({ category }: CategorySectionProps) => {
  const { allProduct, loading } = useProduct(1, 10, category.slug);

  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[380px] animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!allProduct || allProduct.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#FDB713] sm:h-9" />

          <div>
            <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl lg:text-3xl">
              {category.name}
            </h2>

            {category.description && (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {category.description}
              </p>
            )}
          </div>
        </div>
        <Link to={`/category/${category.slug}`}>
          <button
            type="button"
            className="
      
            rounded-xl
            border
            border-gray-200
            px-4
            py-2
            text-sm
            font-semibold
            text-gray-600
            transition
            hover:border-[#FDB713]
            hover:bg-[#FDB713]/10
            hover:text-[#c58b00]
         
          "
          >
            مشاهده همه
          </button>
        </Link>
      </div>

      <div className="category-swiper relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={12}
          slidesPerView={1.15}
          loop={allProduct.length > 4}
          speed={200}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },

            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },

            1024: {
              slidesPerView: 3,
              spaceBetween: 18,
            },

            1280: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="!pb-10"
        >
          {allProduct.map((product) => (
            <SwiperSlide key={product.id}>
              <GetAllProduct product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategorySection;
