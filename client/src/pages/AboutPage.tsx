import { motion } from "framer-motion";
import aboutbaner from "../../assets/imges/about-banner.jpg";
import desAbout from "./DataAboutPage";

const AboutPage = () => {
  return (
    <section className="w-full bg-white py-6 sm:py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="
            relative
            mb-14
            h-56
            overflow-hidden
            rounded-2xl
            sm:h-64
            md:mb-20
            md:h-72
            lg:h-80
          "
        >
          <img
            src={aboutbaner}
            alt="درباره کارسرویس"
            loading="eager"
            decoding="async"
            className="
            w-full h-64
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/65
              via-black/35
              to-black/20
            "
          />

          <div
            className="
              absolute
              right-0
              top-1/2
              h-20
              w-1
              -translate-y-1/2
              rounded-l-full
           
              sm:h-24
              md:h-28
            "
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              px-5
              text-center
              sm:px-10
            "
          >
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-7 bg-[#FDB713] sm:w-10" />

                <span className="text-xs font-medium text-[#FDB713] sm:text-sm">
                  درباره ما
                </span>

                <span className="h-px w-7 bg-[#FDB713] sm:w-10" />
              </div>

              <h1
                className="
                  text-xl
                  font-extrabold
                  leading-9
                  text-white
                  sm:text-2xl
                  md:text-3xl
                  lg:text-4xl
                "
              >
                کارسرویس؛ اولین اجاره خودرو ایرانی به سبک جهانی
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          {desAbout.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.25, 0.8, 0.25, 1],
              }}
              className="
                mb-12
                sm:mb-16
                md:mb-20
              "
            >
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="h-1 w-8 rounded-full bg-[#FDB713] sm:w-10" />

                  <span className="text-xs font-medium text-[#d99a00] sm:text-sm">
                    کارسرویس
                  </span>
                </div>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    leading-9
                    text-gray-900
                    sm:text-2xl
                    md:text-3xl
                    lg:text-[32px]
                  "
                >
                  {item.title}
                </h2>
              </div>

              {item.type === "nullimg" ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-gray-100
                    bg-gray-50/70
                    p-5
                    sm:p-6
                    md:p-8
                  "
                >
                  <p
                    className="
                      whitespace-pre-line
                      text-sm
                      font-medium
                      leading-8
                      text-gray-600
                      sm:text-base
                      sm:leading-9
                      md:text-lg
                    "
                  >
                    {item.text}
                  </p>
                </div>
              ) : (
                <div
                  className={`
                    flex
                    flex-col
                    items-center
                    gap-6
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-6
                    md:gap-10
                    md:p-8
                    lg:gap-14
                    ${
                      item.position === "left"
                        ? "md:flex-row-reverse"
                        : "md:flex-row"
                    }
                  `}
                >
                  <div className="w-full md:flex-1">
                    <p
                      className="
                        whitespace-pre-line
                        text-sm
                        font-medium
                        leading-8
                        text-gray-600
                        sm:text-base
                        sm:leading-9
                        md:text-lg
                      "
                    >
                      {item.text}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{
                      y: -3,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="
                      relative
                      w-full
                      overflow-hidden
                      rounded-xl
                      md:w-[42%]
                      lg:w-[38%]
                    "
                  >
                    <img
                      src={item.img}
                      alt={item.title || "About Image"}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-52
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        hover:scale-[1.025]
                        sm:h-60
                        md:h-64
                        lg:h-72
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/20
                        to-transparent
                      "
                    />

                 
                  </motion.div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
