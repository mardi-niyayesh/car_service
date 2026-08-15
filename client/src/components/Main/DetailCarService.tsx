import detail from "./DataDetailCarService";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Modal from "./Modal";

const DetailCarService = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savetitle, setSavetitle] = useState("");
  const [savetext, setSavetext] = useState("");

  const openModal = (item) => {
    setIsModalOpen(true);
    setSavetitle(item.title);
    setSavetext(item.text);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSavetitle("");
    setSavetext("");
  };

  return (
    <>
      <section className="w-full bg-white py-10 sm:py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#FDB713]" />

              <span className="text-sm font-medium tracking-wide text-[#d99a00]">
                خدمات ما
              </span>

              <span className="h-px w-8 bg-[#FDB713]" />
            </div>

            <h2
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                lg:text-[40px]
                font-extrabold
                leading-tight
                text-gray-900
              "
            >
              خدمات کارسرویس
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
             
                font-medium
                leading-8
                text-gray-500
              "
            >
              همه چیز برای یک تجربه راحت، سریع و مطمئن
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            className="detail-swiper !pb-12"
            slidesPerView={1}
            spaceBetween={16}
            loop={true}
            speed={800}
            watchOverflow={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },

              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },

              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },

              1280: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
          >
            {detail.map((item, index) => (
              <SwiperSlide key={index}>
                <article
                  className="
                    group
                    flex
                    min-h-52.5
                    flex-col
                    justify-between
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    sm:p-6
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-gray-300
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-50
                        border
                        border-gray-100
                        text-[#FDB713]
                        transition-all
                        duration-300
                        group-hover:border-gray-200
                      "
                    >
                      <span className="text-xl">{item.icon}</span>
                    </div>

                    <h3
                      className="
                        text-base
                        sm:text-lg
                        font-bold
                        leading-7
                        text-gray-600
                      "
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="my-6 h-px w-full bg-gray-100" />

                  <button
                    type="button"
                    onClick={() => openModal(item)}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      text-sm
                      font-medium
                      text-gray-500
                      transition-colors
                      duration-300
                      hover:text-gray-900
                      cursor-pointer
                    "
                  >
                    <span>جزئیات بیشتر</span>

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        text-[#FDB713]
                        transition-transform
                        duration-300
                        group-hover:-translate-x-1
                      "
                    >
                      <FaArrowLeft size={14} />
                    </span>
                  </button>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={savetitle}>
        <p
          className="
            text-sm
            sm:text-base
            leading-8
            text-gray-600
          "
        >
          {savetext}
        </p>
      </Modal>
    </>
  );
};

export default DetailCarService;
