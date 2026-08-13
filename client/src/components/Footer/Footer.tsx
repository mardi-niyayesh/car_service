import call from "../../../assets/imges/call-calling.png";
import email from "../../../assets/imges/sms.png";
import map from "../../../assets/imges/map.png";
import logocar from "../../../assets/imges/logo21.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        mt-16
        w-full
        bg-[#1E1E1EE5]
        px-4
        py-8
        sm:px-6
        sm:py-10
        md:mt-24
        md:px-8
        lg:px-10
      "
    >
      <div className="mx-auto w-full max-w-350">
        <div
          className="
            grid
            grid-cols-1
            overflow-hidden
            rounded-2xl
            border
            border-white/10
       bg-[#1A1A1A]
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div
            className="
              group
              flex
              items-center
              gap-4
              border-b
              border-white/10
              p-5
              transition-colors
              duration-300
            bg-white/7

              sm:p-6
              lg:border-b-0
              lg:border-l
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                 bg-white/7
                transition-all
                duration-300
                group-hover:border-[#FDB713]/40
                group-hover:bg-[#FDB713]/10
              "
            >
              <img
                src={call}
                alt="تماس با ما"
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0 text-right">
              <h3 className="mb-1 text-sm font-bold text-white sm:text-base">
                ارتباط با ما
              </h3>

              <div className="space-y-0.5 text-sm text-gray-400">
                <a
                  href="tel:09945812125"
                  className="block transition-colors duration-300 hover:text-[#FDB713]"
                >
                  0994-5812125
                </a>

                <a
                  href="tel:09210629512"
                  className="block transition-colors duration-300 hover:text-[#FDB713]"
                >
                  0921-0629512
                </a>
              </div>
            </div>
          </div>

          <div
            className="
              group
              flex
              items-center
              gap-4
              border-b
              border-white/10
              p-5
              transition-colors
              duration-300
            bg-white/7

              sm:border-l-0
              sm:p-6

              lg:border-b-0
              lg:border-l
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                transition-all
                duration-300
                group-hover:border-[#FDB713]/40
                group-hover:bg-[#FDB713]/10
              "
            >
              <img src={email} alt="ایمیل" className="h-7 w-7 object-contain" />
            </div>

            <div className="min-w-0 text-right">
              <h3 className="mb-1 text-sm font-bold text-white sm:text-base">
                ایمیل
              </h3>

              <div className="space-y-0.5 text-xs sm:text-sm">
                <a
                  href="mailto:niyayesh@gmail.com"
                  className="
        block
        break-all
        text-gray-400
        transition-colors
        duration-300
        hover:text-[#FDB713]
      "
                >
                  niyayesh@gmail.com
                </a>

                <a
                  href="mailto:homow@proton.me"
                  className="
        block
        break-all
        text-gray-400
        transition-colors
        duration-300
        hover:text-[#FDB713]
      "
                >
                  homow@proton.me
                </a>
              </div>
            </div>
          </div>

          <div
            className="
              group
              flex
              items-center
              gap-4
              p-5
              transition-colors
              duration-300
              bg-white/7

              sm:col-span-2
              sm:p-6

              lg:col-span-1
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                transition-all
                duration-300
                group-hover:border-[#FDB713]/40
                group-hover:bg-[#FDB713]/10
              "
            >
              <img src={map} alt="آدرس" className="h-7 w-7 object-contain" />
            </div>

            <div className="text-right">
              <h3 className="mb-1 text-sm font-bold text-white sm:text-base">
                آدرس
              </h3>

              <p className="text-sm text-gray-400">تهران - خیابان شادمان</p>
            </div>
          </div>
        </div>

        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-10
            border-b
            border-white/10
            pb-10

            md:mt-10
            md:grid-cols-2

            lg:grid-cols-[1.5fr_0.7fr_1.2fr]
            lg:gap-16
          "
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src={logocar}
                alt="کارسرویس"
                className="w-20 object-contain sm:w-24"
              />

              <div className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">کار</span>
                <span className="text-[#FDB713]">سرویس</span>
              </div>
            </div>

            <p
              className="
                max-w-xl
                text-sm
                leading-8
                text-gray-400
                sm:text-[15px]
              "
            >
              کارسرویس با رویکرد اعتماد به مشتری، با در اختیار داشتن ناوگانی
              متنوع از خودروهای اقتصادی، لوکس و تجاری، آماده ارائه خدمات اجاره
              خودرو در سراسر کشور است.
            </p>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-[#FDB713]" />

              <h3 className="text-base font-bold text-white">دسترسی آسان</h3>
            </div>

            <ul className="space-y-3  text-gray-400">
              <li>
                <Link
                  to="/questionPage"
                  className="
                    inline-flex
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:text-[#FDB713]
                  "
                >
                  سوالات متداول
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="
                    inline-flex
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:text-[#FDB713]
                  "
                >
                  تماس با ما
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="
                    inline-flex
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:text-[#FDB713]
                  "
                >
                  درباره ما
                </Link>
              </li>

              <li>
                <Link
                  to="/roles"
                  className="
                    inline-flex
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:text-[#FDB713]
                  "
                >
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-[#FDB713]" />

              <h3 className="text-base font-bold text-white">خبرنامه</h3>
            </div>

            <p className="mb-4 text-sm leading-7 text-gray-400">
              برای دریافت جدیدترین تخفیف‌ها و اخبار کارسرویس در خبرنامه ما عضو
              شوید.
            </p>

            <div
              className="
                flex
                flex-col
                gap-2

                sm:flex-row
              "
            >
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-[#222222]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-500
                  transition-all
                  duration-300
                  focus:border-[#FDB713]/60
                  focus:ring-2
                  focus:ring-[#FDB713]/10
                "
              />

              <button
                type="button"
                className="
                  rounded-xl
                  bg-[#FDB713]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-gray-900
                  transition-all
                  duration-300
                  hover:bg-[#ffc52f]
                  hover:shadow-lg
                  hover:shadow-[#FDB713]/10
                  active:scale-95
                "
              >
                ارسال
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {["ig", "tw", "in"].map((social) => (
                <button
                  key={social}
                  type="button"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-[#222222]
                    text-xs
                    font-bold
                    text-gray-400
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#FDB713]
                    hover:bg-[#FDB713]
                    hover:text-gray-900
                  "
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="
            pt-6
            text-center
            text-xs
            leading-6
            text-gray-500
            sm:text-sm
          "
        >
          © {new Date().getFullYear()} تمامی حقوق سایت متعلق به کارسرویس است
        </div>
      </div>
    </footer>
  );
};

export default Footer;
