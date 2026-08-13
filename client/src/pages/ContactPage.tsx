import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <section className="w-full bg-white pb-12 sm:pb-16 md:pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="
          relative
          min-h-55
          w-full
          overflow-hidden
          bg-[url('/assets/imges/page.png')]
          bg-cover
          bg-center
          bg-no-repeat
          sm:min-h-70
          md:min-h-87.5
          lg:min-h-107.5
          xl:min-h-125
        "
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
      <div
        className="
          container
          relative
          z-10
          mx-auto
          -mt-8
          px-4
          sm:-mt-12
          sm:px-6
          md:-mt-16
          lg:-mt-20
          lg:px-8
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
            duration: 0.8,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="
            mx-auto
            max-w-300
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-xl
          "
        >
          <div className="flex flex-col lg:flex-row">
            <div
              className="
                w-full
                bg-gray-50/80
                p-6
                sm:p-8
                md:p-10
                lg:w-1/2
                lg:p-12
              "
            >
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-start gap-3">
                  <span className="h-px w-7 bg-[#FDB713]" />

                  <span className="text-xs font-medium text-[#d99a00]">
                    اطلاعات تماس
                  </span>

                  <span className="h-px w-7 bg-[#FDB713]" />
                </div>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    leading-8
                    text-gray-900
                    sm:text-2xl
                    md:text-3xl
                  "
                >
                  ارتباط با دفتر مرکزی
                </h2>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-sm">
                  <span className="mb-1 block text-sm font-bold text-gray-800">
                    آدرس
                  </span>

                  <p className=" leading-7 text-gray-500 text-[18px] ">
                    تهران، میدان آزادی، خیابان آزادی، خیابان شادمان، پلاک 23
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-sm">
                  <span className="mb-1 block text-sm font-bold text-gray-800">
                    شماره تماس
                  </span>

                  <a
                    href="tel:02166552589"
                    dir="ltr"
                    className="
                      inline-block
                      text-sm
                      text-gray-500
                      transition-colors
                      duration-300
                      hover:text-[#d99a00]
                      sm:text-base
                    "
                  >
                    021-66552589
                  </a>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-sm">
                  <span className="mb-1 block text-sm font-bold text-gray-800">
                    ایمیل
                  </span>

                  <a
                    href="mailto:info@AutoRent.com"
                    className="
                      inline-block
                      break-all
                      text-sm
                      text-gray-500
                      transition-colors
                      duration-300
                      hover:text-[#d99a00]
                      sm:text-base
                    "
                  >
                    info@AutoRent.com
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <span className="mb-1 block text-sm font-bold text-gray-800">
                      ساعت کار اداری
                    </span>

                    <span className="text-sm text-gray-500">۹ تا ۱۸</span>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <span className="mb-1 block text-sm font-bold text-gray-800">
                      پشتیبانی
                    </span>

                    <span className="text-sm text-gray-500">۲۴ ساعته</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-white p-6 sm:p-8 md:p-10 lg:w-1/2 lg:p-12">
              <div className="mx-auto max-w-md">
                <div className="mb-7 text-center">
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <span className="h-px w-7 bg-[#FDB713]" />

                    <span className="text-xs font-medium text-[#d99a00]">
                      فرم تماس
                    </span>

                    <span className="h-px w-7 bg-[#FDB713]" />
                  </div>

                  <h2
                    className="
                      text-xl
                      font-extrabold
                      text-gray-900
                      sm:text-2xl
                      md:text-3xl
                    "
                  >
                    فرم تماس با ما
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    پیام خود را برای ما ارسال کنید.
                  </p>
                </div>

                <form className="space-y-5">
                  <div>
                    <label
                      htmlFor="name1"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      نام
                    </label>

                    <input
                      type="text"
                      id="name1"
                      placeholder="نام خود را وارد کنید"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-gray-400
                        focus:border-[#FDB713]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#FDB713]/20
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name2"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      نام خانوادگی
                    </label>

                    <input
                      type="text"
                      id="name2"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-gray-400
                        focus:border-[#FDB713]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#FDB713]/20
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      ایمیل
                    </label>

                    <input
                      type="email"
                      id="email"
                      placeholder="example@email.com"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-gray-400
                        focus:border-[#FDB713]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#FDB713]/20
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      پیام
                    </label>

                    <textarea
                      id="message"
                      rows={5}
                      placeholder="پیام خود را بنویسید..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        leading-7
                        text-gray-800
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-gray-400
                        focus:border-[#FDB713]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#FDB713]/20
                      "
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="
                      w-full
                      cursor-pointer
                      rounded-xl
                      bg-[#FDB713]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                      transition-shadow
                      duration-300
                      hover:shadow-md
                      sm:text-base
                    "
                  >
                    ارسال پیام
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;
