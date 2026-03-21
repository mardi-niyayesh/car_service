const ContactPage = () => {
  return (
    <>
      <div className="bg-[url('../../assets/page.png')] bg-cover bg-center bg-no-repeat w-full min-h-[250px] md:min-h-[400px] lg:min-h-[550px] xl:h-[683px] relative"></div>
      <div className="container rounded-2xl mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]  mt-10 mb-10 bg-[#EDEDED] ">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 py-8 md:py-12 lg:py-16">
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8">
            <h2 className="text-blue-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-[24px] pb-2 mb-4">
              ارتباط با دفتر مرکزی اتورنت
            </h2>
            <div className="flex flex-wrap items-start gap-1">
              <span className="text-[#494949] font-medium whitespace-nowrap">
                آدرس:
              </span>
              <span className="text-[#9A9A9A] text-sm md:text-base">
                تهران، میدان آزادی، خیابان آزادی، خیابان شادمان، پلاک 23
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[#494949] font-medium whitespace-nowrap">
                شماره تماس:
              </span>
              <span className="text-[#9A9A9A] text-sm md:text-base" dir="ltr">
                02166552589
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[#494949] font-medium whitespace-nowrap">
                ایمیل:
              </span>
              <span className="text-[#9A9A9A] text-sm md:text-base">
                info@AutoRent.com
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[#494949] font-medium whitespace-nowrap">
                ساعت کار اداری:
              </span>
              <span className="text-[#9A9A9A] text-sm md:text-base" dir="ltr">
                ۹ تا ۱۸
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[#494949] font-medium whitespace-nowrap">
                ساعت کار پشتیبانی:
              </span>
              <span className="text-[#9A9A9A] text-sm md:text-base" dir="ltr">
                ۲۴ ساعته ۷ روز هفته
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-blue-800 font-bold text-lg sm:text-xl md:text-2xl text-center lg:text-[24px] pb-2 mb-4">
              فرم تماس با ما
            </h1>
            <p className="text-gray-500 mb-6 ">
              انتقادات، پیشنهادات و شکایات خود را از طریق فرم زیر با ما در میان
              بگذارید.
            </p>
            <form>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    نام
                  </label>

                  <input
                    type="text"
                    id="name1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    نام خانوادگی
                  </label>

                  <input
                    type="text"
                    id="name2"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    پیغام
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    ارسال
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
