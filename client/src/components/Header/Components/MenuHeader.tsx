import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FaRegCalendarAlt, FaChevronDown } from "react-icons/fa";

const menuItems = [
  {
    id: 1,
    label: "خانه",
    path: "/",
  },
  {
    id: 2,
    label: "رزرو",

    dropdownItems: [
      {
        id: 4,
        label: "رزرو خودرو در مشهد",
        path: "/reserve/mashhad",
      },
      {
        id: 5,
        label: "رزرو خودرو در تبریز",
        path: "/reserve/tabriz",
      },
      {
        id: 6,
        label: "رزرو خودرو در شیراز",
        path: "/reserve/shiraz",
      },
      {
        id: 7,
        label: "رزرو خودرو در ساری",
        path: "/reserve/sary",
      },
      {
        id: 8,
        label: "رزرو خودرو در قشم",
        path: "/reserve/qeshm",
      },
      {
        id: 9,
        label: "رزرو خودرو در نیشابور",
        path: "/reserve/neyshaboor",
      },
      {
        id: 10,
        label: "رزرو خودرو در یزد",
        path: "/reserve/yazd",
      },
    ],
  },
  {
    id: 3,
    label: "بلاگ",
    path: "/blog",
  },
  {
    id: 4,
    label: "درباره ما",
    path: "/about",
  },
  {
    id: 5,
    label: "تماس ما",
    path: "/contact",
  },
];

const MenuHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isReserveOpen, setIsReserveOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="hidden md:block w-full bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-staet gap-2 lg:gap-4">
            {menuItems.map((item) => {
              const active = item.path ? isActive(item.path) : false;

              if (item.dropdownItems) {
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

                      <span>{item.label}</span>

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
                          {item.dropdownItems.map((option, index) => (
                            <motion.button
                              key={option.id}
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
                              onClick={() => {
                                navigate(option.path);
                                setIsReserveOpen(false);
                              }}
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
                              {option.label}
                            </motion.button>
                          ))}
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

          if (item.dropdownItems) {
            return (
              <div
                key={item.id}
                className="relative flex h-full w-1/5 items-center justify-center"
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
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        p-2
                        shadow-2xl
                      "
                    >
                      <div className="mb-1 px-3 py-2 text-right text-xs font-bold text-gray-400">
                        انتخاب شهر
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        {item.dropdownItems.map((option, index) => (
                          <motion.button
                            key={option.id}
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
                              delay: index * 0.025,
                            }}
                            onClick={() => {
                              navigate(option.path);
                              setIsReserveOpen(false);
                            }}
                            className="
                              w-full
                              rounded-xl
                              px-3
                              py-2.5
                              text-right
                              text-xs
                              text-gray-600
                              transition-colors
                              duration-200
                              hover:bg-[#FDB713]/10
                              hover:text-[#c58b00]
                            "
                          >
                            {option.label}
                          </motion.button>
                        ))}
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
              className="relative flex h-full w-1/5 items-center justify-center"
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
                      h-0.75
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
