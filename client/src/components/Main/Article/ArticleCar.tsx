import { motion } from "framer-motion";
import ComponentArticleCar from "./ComponentArticleCar";

const ArticleCar = () => {
  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16">
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="mb-8 sm:mb-10 text-center px-4"
      >
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#FDB713]" />

          <span
            className="
              text-xs
              sm:text-sm
              font-medium
              tracking-wide
              text-[#d99a00]
            "
          >
            مجله کارسرویس
          </span>

          <span className="h-px w-8 bg-[#FDB713]" />
        </div>

        <h2
          className="
            text-2xl
            sm:text-3xl
            md:text-4xl

            font-extrabold
            leading-tight

            text-gray-900
          "
        >
          مقالات کارسرویس
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-lg
            text-[13px]
            sm:text-sm
            md:text-[15px]
            leading-7
            text-gray-500
          "
        >
          مطالب کاربردی و نکات مفید درباره خودرو و اجاره خودرو
        </p>
      </motion.div>
      <ComponentArticleCar />
    </section>
  );
};

export default ArticleCar;
