import { useState } from "react";

import BMW from "../../../assets/imges/BMW.png";
import Honda from "../../../assets/imges/Honda.png";
import Hyundai from "../../../assets/imges/Hyundai.png";
import KIA1 from "../../../assets/imges/KIA (1).png";
import Marcedes from "../../../assets/imges/Marcedes.png";
import Nissan from "../../../assets/imges/Nissan.png";
import Toyota from "../../../assets/imges/Toyota.png";
import lexus from "../../../assets/imges/lexus-logo.png";

const icons = [
  { id: 1, icon: BMW },
  { id: 2, icon: Honda },
  { id: 3, icon: Hyundai },
  { id: 4, icon: KIA1 },
  { id: 5, icon: Marcedes },
  { id: 6, icon: Nissan },
  { id: 7, icon: Toyota },
  { id: 8, icon: lexus },
];

const CarParts = () => {
  const [activeBrand, setActiveBrand] = useState<number | null>(null);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="mb-7 mt-10 text-center sm:mt-12">
        <div className="mb-3 flex items-center justify-center gap-3"></div>

        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#FDB713]" />

          <span className="text-sm font-medium tracking-wide text-[#d99a00]">
            برند  ها
          </span>

          <span className="h-px w-8 bg-[#FDB713]" />
        </div>

        <h2
          className="
            text-xl
            font-medium
            text-gray-900
            sm:text-2xl
            md:text-3xl
          "
        >
          برندهای همکار با ما
        </h2>

        <p
          className="
    mx-auto
    mt-3
    max-w-lg
    px-4
    text-center
    text-sm
    sm:text-[15px]
    md:text-base
    leading-7
    sm:leading-8
    font-normal
    text-gray-500
    tracking-normal
  "
        >
          همکاری با برندهای معتبر برای ارائه تجربه‌ای مطمئن‌تر
        </p>
      </div>

      <div
        className="
          mx-auto
          grid
          max-w-300
          grid-cols-2
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          sm:grid-cols-4
          md:flex
          md:items-center
          md:justify-between
          md:px-6
          lg:px-10
        "
      >
        {icons.map((item, index) => {
          const isActive = activeBrand === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveBrand(item.id)}
              className={`
                group
                flex
                h-24
                w-full
                items-center
                justify-center
                px-4
                transition-all
                duration-300
                hover:bg-gray-50
                sm:h-28
                md:h-32
                md:flex-1

                ${
                  index < icons.length - 1
                    ? "border-b border-gray-100 sm:border-gray-100 md:border-b-0 md:border-l"
                    : ""
                }

                ${isActive ? "bg-gray-50" : "bg-white"}
              `}
              aria-label={`برند ${item.id}`}
            >
              <img
                src={item.icon}
                alt={`brand-${item.id}`}
                className={`
                  max-h-11
                  max-w-21.25
                  object-contain
                  transition-all
                  duration-300
                  sm:max-h-12
                  sm:max-w-25
                  md:max-h-14
                  md:max-w-28.75

                  ${
                    isActive
                      ? "scale-105 opacity-100 grayscale-0"
                      : "opacity-60 grayscale"
                  }

                  group-hover:scale-105
                  group-hover:opacity-100
                  group-hover:grayscale-0
                `}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CarParts;
