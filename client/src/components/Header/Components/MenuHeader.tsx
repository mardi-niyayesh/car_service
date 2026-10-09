import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FaRegCalendarAlt, FaChevronDown } from "react-icons/fa";

import { useCategories } from "../../../hooks/useCategories";

const MenuHeader = () => {
  const navigate = useNavigate();

  const [isReserveOpen, setIsReserveOpen] = useState(false);

  const { categories, loading } = useCategories();

  const menuItems = [
    {
      id: 1,
      name: "خانه",
      label: "خانه",
      path: "/",
    },
    {
      id: 2,
      name: "رزرو",
      label: "رزرو",
      categories: true,
    },
    {
      id: 3,
      name: "بلاگ",
      label: "بلاگ",
      path: "/blog",
    },
    {
      id: 4,
      name: "درباره ما",
      label: "درباره ما",
      path: "/about",
    },
    {
      id: 5,
      name: "تماس با ما",
      label: "تماس با ما",
      path: "/contact",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
    setIsReserveOpen(false);
  };

  return (
    <>
      <nav className="hidden w-full bg-white md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-start gap-2 lg:gap-4">
            {menuItems.map((item) => {
              const active = item.path ? isActive(item.path) : false;

              if (item.categories) {
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setIsReserveOpen(true)}
                    onMouseLeave={() => setIsReserveOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsReserveOpen((prev) => !prev)}
                      className={`
                        relative
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition-colors
                        duration-300
                        ${
                          isReserveOpen
                            ? "text-[#d99a00]"
                            : "text-gray-700 hover:text-[#d99a00]"
                        }
                      `}
                    >
                      <FaRegCalendarAlt className="text-base" />

                      <span>{item.name}</span>

                      <motion.span
                        animate={{
                          rotate: isReserveOpen ? 180 : 0,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: "easeOut",
                        }}
                      >
                        <FaChevronDown className="text-[11px]" />
                      </motion.span>

                      {isReserveOpen && (
                        <motion.span
                          layoutId="menu-active"
                          className="
                            absolute
                            bottom-0
                            left-3
                            right-3
                            h-[3px]
                            rounded-full
                            bg-[#FDB713]
                          "
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isReserveOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 6,
                          }}
                          transition={{
                            duration: 0.22,
                            ease: [0.25, 0.8, 0.25, 1],
                          }}
                          className="
                            absolute
                            right-0
                            top-full
                            z-50
                            mt-1
                            w-64
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-100
                            bg-white
                            p-2
                            shadow-xl
                          "
                        >
                          <div
                            className="
                              mb-1
                              px-3
                              py-2
                              text-right
                              text-xs
                              font-bold
                              text-gray-400
                            "
                          >
                            انتخاب دسته‌بندی
                          </div>

                          <div className="max-h-[320px] overflow-y-auto">
                            {loading ? (
                              <div className="px-4 py-3 text-right text-sm text-gray-400">
                                در حال دریافت دسته‌بندی‌ها...
                              </div>
                            ) : categories.length > 0 ? (
                              categories.map((category, index) => (
                                <motion.button
                                  key={category.id}
                                  type="button"
                                  initial={{
                                    opacity: 0,
                                    x: 8,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  transition={{
                                    duration: 0.2,
                                    delay: index * 0.025,
                                  }}
                                  onClick={() =>
                                    handleCategoryClick(category.slug)
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-right
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    transition-all
                                    duration-200
                                    hover:bg-[#FDB713]/10
                                    hover:pr-5
                                    hover:text-[#c58b00]
                                  "
                                >
                                  {category.name}
                                </motion.button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-right text-sm text-gray-400">
                                دسته‌بندی‌ای وجود ندارد
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`
                      relative
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition-colors
                      duration-300
                      ${
                        active
                          ? "text-[#d99a00]"
                          : "text-gray-700 hover:text-[#d99a00]"
                      }
                    `}
                  >
                    <span>{item.label}</span>

                    {active && (
                      <motion.span
                        layoutId="menu-active"
                        className="
                          absolute
                          bottom-0
                          left-3
                          right-3
                          h-[3px]
                          rounded-full
                          bg-[#FDB713]
                        "
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <motion.nav
        initial={{
          y: 70,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          h-[68px]
          items-center
          justify-around
          border-t
          border-gray-200
          bg-white/95
          px-2
          shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
          backdrop-blur-md
          md:hidden
        "
      >
        {menuItems.map((item) => {
          const active = item.path ? isActive(item.path) : false;

          if (item.categories) {
            return (
              <div
                key={item.id}
                className="
                  relative
                  flex
                  h-full
                  w-1/5
                  items-center
                  justify-center
                "
              >
                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.92,
                  }}
                  onClick={() => setIsReserveOpen((prev) => !prev)}
                  className={`
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    transition-colors
                    duration-300
                    ${isReserveOpen ? "text-[#d99a00]" : "text-gray-500"}
                  `}
                >
                  <motion.span
                    animate={{
                      rotate: isReserveOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="text-[19px]"
                  >
                    <FaRegCalendarAlt />
                  </motion.span>

                  <span className="text-[11px] font-semibold">
                    {item.label}
                  </span>

                  {(isReserveOpen || active) && (
                    <motion.span
                      layoutId="mobile-active"
                      className="
                        absolute
                        bottom-1
                        h-[3px]
                        w-8
                        rounded-full
                        bg-[#FDB713]
                      "
                    />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isReserveOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="
                        absolute
                        bottom-[73px]
                        right-1/2
                        z-50
                        w-60
                        translate-x-1/2
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        p-2
                        shadow-2xl
                      "
                    >
                      <div
                        className="
                          mb-1
                          px-3
                          py-2
                          text-right
                          text-xs
                          font-bold
                          text-gray-400
                        "
                      >
                        انتخاب دسته‌بندی
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        {loading ? (
                          <div className="px-3 py-3 text-right text-xs text-gray-400">
                            در حال دریافت...
                          </div>
                        ) : categories.length > 0 ? (
                          categories.map((category, index) => (
                            <motion.button
                              key={category.id}
                              type="button"
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.025,
                              }}
                              onClick={() => handleCategoryClick(category.slug)}
                              className="
                                flex
                                w-full
                                items-center
                                rounded-xl
                                px-3
                                py-2.5
                                text-right
                                text-xs
                                font-semibold
                                text-gray-600
                                transition-all
                                duration-200
                                hover:bg-[#FDB713]/10
                                hover:text-[#c58b00]
                              "
                            >
                              {category.name}
                            </motion.button>
                          ))
                        ) : (
                          <div className="px-3 py-3 text-right text-xs text-gray-400">
                            دسته‌بندی‌ای وجود ندارد
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <motion.div
              key={item.id}
              whileTap={{
                scale: 0.9,
              }}
              className="
                relative
                flex
                h-full
                w-1/5
                items-center
                justify-center
              "
            >
              <Link
                to={item.path}
                className={`
                  flex
                  h-full
                  w-full
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  transition-colors
                  duration-300
                  ${active ? "text-[#d99a00]" : "text-gray-500"}
                `}
              >
                <motion.span
                  animate={{
                    scale: active ? 1.08 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="text-[19px]"
                >
                  {item.icon}
                </motion.span>

                <span className="text-[11px] font-semibold">{item.label}</span>

                {active && (
                  <motion.span
                    layoutId="mobile-active"
                    className="
                      absolute
                      bottom-1
                      h-[3px]
                      w-8
                      rounded-full
                      bg-[#FDB713]
                    "
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>
    </>
  );
};

export default MenuHeader;
