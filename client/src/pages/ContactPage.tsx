const ContactPage = () => {
  return (
    <>
      <div className="bg-[url('../../assets/imges/page.png')] bg-cover bg-center bg-no-repeat w-full min-h-[200px] sm:min-h-[250px] md:min-h-[350px] lg:min-h-[450px] xl:h-[550px] relative" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 relative z-10">
        <div className="bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch gap-0">
            <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12">
              <h2 className="text-yellow-700 font-bold text-xl sm:text-2xl md:text-3xl lg:text-[28px] pb-2 mb-6 border-b-2 border-gray-200">
                ارتباط با دفتر مرکزی
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div>
                    <span className="block text-[#494949] font-semibold text-sm sm:text-base">
                      آدرس:
                    </span>
                    <span className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed">
                      تهران، میدان آزادی، خیابان آزادی، خیابان شادمان، پلاک 23
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[#494949] font-semibold text-sm sm:text-base">
                      شماره تماس:
                    </span>
                    <span
                      className="text-[#6B6B6B] text-sm sm:text-base"
                      dir="ltr"
                    >
                      021-66552589
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[#494949] font-semibold text-sm sm:text-base">
                      ایمیل:
                    </span>
                    <span className="text-[#6B6B6B] text-sm sm:text-base">
                      info@AutoRent.com
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[#494949] font-semibold text-sm sm:text-base">
                      ساعت کار اداری:
                    </span>
                    <span className="text-[#6B6B6B] text-sm sm:text-base">
                      ۹ تا ۱۸
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <span className="block text-[#494949] font-semibold text-sm sm:text-base">
                      ساعت کار پشتیبانی:
                    </span>
                    <span
                      className="text-[#6B6B6B] text-sm sm:text-base"
                      dir="ltr"
                    >
                      ۲۴ ساعته، ۷ روز هفته
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
              <div className="max-w-md mx-auto">
                <h1 className="text-yellow-700 font-bold text-xl sm:text-2xl md:text-3xl text-center pb-2 mb-3">
                  فرم تماس با ما
                </h1>
                <p className="text-gray-500 text-sm sm:text-base text-center mb-6 leading-relaxed">
                  انتقادات، پیشنهادات و شکایات خود را از طریق فرم زیر با ما در
                  میان بگذارید.
                </p>

                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name1"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      نام
                    </label>
                    <input
                      type="text"
                      id="name1"
                      placeholder="نام خود را وارد کنید"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 outline-none focus:ring-yellow-400 focus:border-yellow-400 transition-shadow text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name2"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="name2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 outline-none focus:ring-yellow-400 focus:border-yellow-400 transition-shadow text-sm"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ایمیل
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 outline-none focus:ring-yellow-400 focus:border-yellow-400 transition-shadow text-sm"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      پیغام
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-2.5 border  border-gray-300 rounded-lg focus:ring-1 outline-none focus:ring-yellow-400 focus:border-yellow-400 transition-shadow text-sm "
                      placeholder="پیغام خود را بنویسید..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
                  >
                    ارسال پیام
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactPage;
