import call from "../../../assets/call-calling.png";
import email from "../../../assets/sms.png";
import map from "../../../assets/map.png";
import logocar from "../../../assets/logoo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#1E1E1EE5] w-full mt-8 md:mt-[100px]  px-4 md:px-8 lg:px-8 py-6 md:py-8 ">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 border-[#868686] border-2 p-4 md:p-6 rounded-2xl mb-6 md:mb-8">
        <div className="flex justify-start items-center gap-3 md:gap-5 w-full md:w-auto md:px-4 md:border-l-2 border-[#868686] md:first:border-l-0">
          <img
            src={call}
            alt="call"
            className="border rounded-2xl p-2 border-[#FFFBFB] w-12 h-12 md:w-14 md:h-14"
          />
          <div className="text-[#9A9A9A] text-sm md:text-[16px] text-right md:text-center">
            <h2 className="font-medium mb-1">ارتباط با ما</h2>
            <p className="text-white">0994-5812125</p>
            <p className="text-white">0921-0629512</p>
          </div>
        </div>

        <div className="flex justify-start md:justify-center items-center gap-3 md:gap-5 w-full md:w-auto md:px-4 md:border-l-2 border-[#868686]">
          <img
            src={email}
            alt="email"
            className="border rounded-2xl p-2 border-[#FFFBFB] w-12 h-12 md:w-14 md:h-14"
          />
          <div className="text-[#9A9A9A] text-sm md:text-[16px] text-right md:text-center">
            <h2 className="font-medium mb-1">ایمیل</h2>
            <p className="text-white text-xs md:text-sm">
              niyayeshammardii@gmail.com
            </p>
            <p className="text-white text-xs md:text-sm">homow_dev@proton.me</p>
          </div>
        </div>

        <div className="flex justify-start md:justify-center items-center gap-3 md:gap-5 w-full md:w-auto">
          <img
            src={map}
            alt="map"
            className="border rounded-2xl p-2 border-[#9A9A9A] w-12 h-12 md:w-14 md:h-14"
          />
          <div className="text-[#9A9A9A] text-sm md:text-[16px] text-right md:text-center">
            <h2 className="font-medium mb-1">آدرس</h2>
            <p className="text-white">تهران- خ شادمان</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-10 pb-6 md:pb-8 border-b-2 border-[#9A9A9A]">
        <div className="w-full lg:w-2/5">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <img
              src={logocar}
              alt="logocar"
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <div className="font-bold text-2xl md:text-[24px]">
              <span className="text-[#FFFFFF]">اُتــو</span>
              <span className="text-[#FDB713]">رِنت</span>
            </div>
          </div>

          <p className="text-[#9A9A9A] text-sm md:text-[14px] leading-relaxed mt-2 md:mt-4">
            اتورنت با رویکرد اعتماد به مشتری، با در اختیار داشتن بزرگترین ناوگان
            خودرویی متشکل از انواع خودروهای صفر کیلومتر، اقتصادی تا تجاری در
            سراسر کشور ایران آماده خدمت‌رسانی به مشتریان است.
          </p>
        </div>

        <div className="w-full lg:w-1/5">
          <h3 className="text-white font-medium text-lg md:text-[18px] mb-4 md:mb-6">
            دسترسی آسان
          </h3>
          <ul className="text-[#9A9A9A] text-sm md:text-[14px] space-y-3 md:space-y-4">
            <li className="hover:text-white cursor-pointer transition-colors">
              <Link to="/questionPage"> سوالات متداول </Link>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              <Link to="/contact">تماس با ما </Link>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              <Link to="/about"> درباره ما </Link>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              <Link to="/roles"> قوانین و مقررات </Link>
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-2/5">
          <h3 className="text-white font-medium text-lg md:text-[18px] mb-4">
            خبرنامه
          </h3>
          <p className="text-[#9A9A9A] text-sm md:text-[14px] mb-4">
            برای دریافت جدیدترین تخفیف‌ها و اخبار در خبرنامه ما عضو شوید
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="bg-[#2A2A2A] text-white text-sm md:text-[14px] px-4 py-3 md:py-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#FDB713]"
            />
            <button className="bg-[#FDB713] text-black font-medium text-sm md:text-[14px] px-6 py-3 md:py-4 rounded-xl hover:bg-[#E5A500] transition-colors whitespace-nowrap">
              ارسال
            </button>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center cursor-pointer hover:bg-[#FDB713] transition-colors">
              <span className="text-white">ig</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center cursor-pointer hover:bg-[#FDB713] transition-colors">
              <span className="text-white">tw</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center cursor-pointer hover:bg-[#FDB713] transition-colors">
              <span className="text-white">in</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[#9A9A9A] text-xs md:text-[14px] text-center py-4 md:py-6">
        © {new Date().getFullYear()} تمامی حقوق سایت متعلق به کارسرویس  است
      </div>
    </div>
  );
};

export default Footer;
