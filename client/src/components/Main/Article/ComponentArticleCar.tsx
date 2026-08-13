import { Article } from "./DataArticle";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ComponentArticleCar = () => {
  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16">
      <div
        className="
          container
          mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-5
          sm:gap-6
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {Article.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.99,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.25, 0.8, 0.25, 1],
            }}
            whileHover={{
              y: -3,
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            whileTap={{
              scale: 0.99,
              transition: {
                duration: 0.15,
              },
            }}
            className="
              flex
              h-full
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
              transition-shadow
              duration-300
              hover:shadow-lg
            "
          >
            <motion.div
              className="
                relative
                h-48
                w-full
                overflow-hidden
                bg-gray-100
              "
            >
              <motion.img
                src={item.img}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="
    h-full
    w-full
    object-cover
  "
                initial={{
                  scale: 1.02,
                }}
                whileInView={{
                  scale: 1,
                }}
                whileHover={{
                  scale: 1.035,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
              />

              <motion.div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/25
                  via-black/5
                  to-transparent
                "
                initial={{
                  opacity: 0,
                }}
                whileHover={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              />

              <div
                className="
                  absolute
                  right-4
                  top-4
                  rounded-full
                  border
                  border-white/30
                  bg-black/25
                  px-3
                  py-1
                  text-[11px]
                  font-medium
                  text-white
                  backdrop-blur-md
                "
              >
                مقاله
              </div>
            </motion.div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <motion.h3
                className="
                  line-clamp-2
                  text-base
                  sm:text-lg
                  font-bold
                  leading-7
                  text-gray-800
                "
                whileHover={{
                  color: "#d99a00",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {item.title}
              </motion.h3>

              <p
                className="
                  mt-3
                  line-clamp-3
                  text-sm
                  sm:text-[15px]
                  leading-7
                  text-gray-500
                "
              >
                {item.text}
              </p>

              <div className="mt-auto pt-6">
                <Link to={`/articles/${item.id}`} className="block">
                  <motion.div
                    whileHover={{
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#FDB713]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                    "
                  >
                    <span>اطلاعات بیشتر</span>

                    <motion.span
                      whileHover={{
                        x: -4,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="text-base"
                    >
                      ←
                    </motion.span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default ComponentArticleCar;
