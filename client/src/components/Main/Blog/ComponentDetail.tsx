import { motion } from "framer-motion";

type Description = {
  id?: number;
  img: string;
  title: string;
  des: string;
};

const ComponentDetail = ({ img, title, des }: Description) => {
  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-2xl shadow-md"
      >
        <motion.img
          src={img}
          alt={title}
          className="
            w-full
            max-h-96
            object-cover
          "
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.03 }}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.25,
          ease: "easeOut",
        }}
        className="
    mt-6
    mb-6
    flex
    w-full
    items-start
    gap-2.5
    text-right
    text-lg
    font-bold
    leading-8
    text-gray-800
    sm:mt-8
    sm:mb-7
    sm:gap-3
    sm:text-xl
    sm:leading-9
    md:text-2xl
    md:leading-10
    lg:text-3xl
    lg:leading-[1.6]
    xl:text-4xl
  "
      >
        <span
      className="
      mt-1
      h-7
      w-1
      shrink-0
      rounded-full
      sm:mt-1
      sm:h-8
      md:h-9
      lg:h-11
    "
        />

      <span className="min-w-0 flex-1 break-words">{title}</span>
      </motion.h1>

    
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.45,
          ease: "easeOut",
        }}
        className="
          rounded-2xl
          border
          border-gray-100
          bg-gray-50/70
          p-5
          shadow-sm
          sm:p-6
          md:p-8
        "
      >
        <p
          className="
            text-justify
            text-sm
            font-medium
            leading-8
            text-gray-600
            sm:text-base
            sm:leading-9
            md:text-lg
            md:leading-10
          "
        >
          {des}
        </p>
      </motion.div>
    </section>
  );
};

export default ComponentDetail;
