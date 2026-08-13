import { motion } from "framer-motion";

type ReserveProps = {
  title: string;
  text: string;
  heder: string;
  img: string;
};

const ReserveComponent = ({ title, img, text, heder }: ReserveProps) => {
  return (
    <section className="w-full py-8 sm:py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  

        <motion.div
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
            amount: 0.15,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-100
            bg-white
            shadow-[0_8px_35px_rgba(0,0,0,0.06)]

            md:p-2
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-7
              p-4
              sm:p-6
              md:flex-row
              md:gap-10
              md:p-8
              lg:gap-14
              lg:p-10
            "
          >
            <motion.div
              whileHover={{
                scale: 1.015,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="
                relative
                w-full
                overflow-hidden
                rounded-2xl
                bg-gray-100
                sm:max-w-130
                md:w-[40%]
                md:max-w-none
              "
            >
              <img
                src={img}
                alt={title}
                loading="lazy"
                decoding="async"
                className="
                  aspect-[4/3]
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  hover:scale-[1.03]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/20
                  via-transparent
                  to-transparent
                "
              />
            </motion.div>

            <div className="w-full flex-1">
              <div className="mb-5">
                <h2
                  className="
                    inline-block
                    text-lg
                    font-bold
                    leading-8
                    text-gray-800

                    sm:text-xl
                    md:text-2xl
                  "
                >
                  {heder}
                </h2>

                <div
                  className="
                    mt-2
                    h-1
                    w-10
                    rounded-full
                    bg-[#FDB713]
                  "
                />
              </div>

              <p
                className="
                  text-sm
                  font-medium
                  leading-8
                  text-gray-600
                  text-justify

                  sm:text-[15px]
                  sm:leading-9

                  md:text-base
                  md:leading-9
                "
              >
                {text}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReserveComponent;
