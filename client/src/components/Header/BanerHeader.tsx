import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import blog2 from "../../../assets/imges/blog2.png";
import det2207 from "../../../assets/imges/car1.jpg";
import car3 from "../../../assets/imges/car3.jpg";

const slides = [
  {
    image: blog2,
    normalTitle: "کارسرویس سریع،",
    highlightTitle: "آسان و به صرفه",
    description: "سرویس دهنده رزرو خودرو در ایران در کمترین زمان ممکن!",
  },
  {
    image: det2207,
    normalTitle: "خودروی مناسب",
    highlightTitle: "خودت رو پیدا کن",
    description: "با چند کلیک ساده، خودروی مورد نظرت رو رزرو کن.",
  },
  {
    image: car3,
    normalTitle: "رزرو خودرو،",
    highlightTitle: "ساده‌تر از همیشه",
    description: "سریع، مطمئن و بدون دردسر خودروی مورد نظرت رو رزرو کن.",
  },
];

const BannerHeader = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setShowActions(false);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleMobileClick = () => {
    setShowActions((prev) => !prev);
  };

  return (
    <section
      className="
        relative
        w-full
        h-150
        sm:h-162.5
        md:h-175
        lg:h-[calc(100vh-80px)]
        min-h-140

        overflow-hidden

        bg-black
      "
      onMouseEnter={() => {
        setIsPaused(true);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setShowActions(false);
      }}
      onClick={handleMobileClick}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`
            absolute
            inset-0

            bg-cover
            bg-center
            bg-no-repeat

            transition-all
            duration-[1600ms]
            ease-in-out

            ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[1.08]"
            }
          `}
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
        />
      ))}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/80
          via-black/45
          to-black/10
        "
      />

      <div
        className="
          absolute
          inset-0

          md:hidden
          bg-gradient-to-t
          from-black/85
          via-black/30
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10
          h-full
          flex
          items-center
          px-5
          sm:px-8
          md:px-12
          lg:px-20
          xl:px-28
        "
      >
        <div
          key={currentSlide}
          className="
            w-full
            max-w-190
            text-right
            text-white
            animate-[heroContent_.9s_cubic-bezier(.16,1,.3,1)]
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              mb-4
              md:mb-6
              px-4
              py-2
              rounded-full
              border
              border-white/20
              bg-white/10
              backdrop-blur-md
              text-white/90
              text-xs
              sm:text-sm
              animate-[heroLabel_.7s_ease-out]
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-[#FDB713]
                shadow-[0_0_12px_#FDB713]
              "
            />
            خدمات خودرو با کیفیت و سریع
          </div>

          <h1
            className="
              font-extrabold

              text-[34px]
              sm:text-[40px]
              md:text-[52px]
              lg:text-[60px]
              xl:text-[68px]
              leading-[1.45]
              tracking-tight
              drop-shadow-[0_5px_20px_rgba(0,0,0,0.4)]
              animate-[heroTitle_.9s_cubic-bezier(.16,1,.3,1)]
            "
          >
            <span className="text-white">
              {slides[currentSlide].normalTitle}
            </span>

            <br />

            <span className="text-[#FDB713]">
              {slides[currentSlide].highlightTitle}
            </span>
          </h1>

          <p
            className="
              mt-5
              md:mt-6
              max-w-155
              text-[15px]
              sm:text-[17px]
              md:text-[19px]
              lg:text-[21px]
              leading-[2]
              text-white/85
              font-normal
              drop-shadow-lg
              animate-[heroDescription_.9s_ease-out_.15s_both]
            "
          >
            {slides[currentSlide].description}
          </p>

          <div
            className={`
              flex
              flex-col
              sm:flex-row
              gap-3
              sm:gap-4
              mt-8
              md:mt-10
              transition-all
              duration-700

              ${
                showActions
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5 pointer-events-none"
              }
            `}
          >
            <Link
              to="/contact"
              onClick={(e) => e.stopPropagation()}
              className="
                group
                flex
                items-center
                justify-center
                px-7
                py-3.5
                md:px-9
                md:py-4
                rounded-xl
                border
                border-white/40
                bg-white/10
                backdrop-blur-xl
                text-white
                font-medium
                shadow-lg
                transition-all
                duration-300
                hover:bg-white/20
                hover:border-white/70
                hover:-translate-y-1
                hover:shadow-2xl
              "
            >
              تماس با ما
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();

                // TODO:
              }}
              className="
                flex
                items-center
                justify-center
                px-7
                py-3.5
                md:px-9
                md:py-4
                rounded-xl
                bg-[#FDB713]
                text-black
                font-bold
                shadow-[0_10px_30px_rgba(253,183,19,0.25)]
                transition-all
                duration-300
                hover:bg-[#ffc52f]
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(253,183,19,0.35)]

                active:scale-95
              "
            >
              رزرو آسان خودرو
            </button>
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          z-20
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded-full
          bg-black/20
          backdrop-blur-md
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();

              setCurrentSlide(index);
              setShowActions(false);
            }}
            className={`
              h-2
              rounded-full
              transition-all
              duration-500

              ${
                index === currentSlide
                  ? "w-10 bg-[#FDB713]"
                  : "w-2 bg-white/50 hover:bg-white"
              }
            `}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>

      <div
        className="
          md:hidden
          absolute
          top-5
          right-5
          z-20
          px-3
          py-1.5
          rounded-full
          bg-black/25
          backdrop-blur-md
          text-xs
          text-white/80
        "
      >
        برای مشاهده گزینه‌ها لمس کنید
      </div>
    </section>
  );
};

export default BannerHeader;
