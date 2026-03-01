import { Link } from "react-router-dom";
const BanerHeader = () => {
  return (
    <div className="bg-[url('/assets/backgronCar.png')] bg-cover bg-center bg-no-repeat w-full min-h-[400px] md:min-h-[550px] lg:h-[683px] relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      <div className="container max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 pt-8 md:pt-12 lg:pt-16">
        <div className="max-w-2xl">
          <h2 className="text-[#FDB713] font-bold text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] xl:text-[52px] leading-tight mb-4 md:mb-6">
            اُتـــو رِنت؛ سریع، آسان و به صرفه
          </h2>

          <p className="text-[#F9F9F9] font-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-justify md:text-right mb-6 md:mb-8 max-w-lg">
            سرویس دهنده رزرو خودرو در ایران در کمترین زمان ممکن!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-12">
            <div className="flex items-center justify-center w-full sm:w-fit px-6 py-3 md:px-8 md:py-4 gap-3 border-2 border-[#F9F9F9] rounded-lg hover:bg-white/10 transition-all duration-300 group cursor-pointer">
              <Link to="contact">
                
                <button className="text-[#F9F9F9] font-medium text-[16px] md:text-[18px] whitespace-nowrap">
                  تماس با ما
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center w-full sm:w-fit px-6 py-3 md:px-8 md:py-4 gap-3 bg-[#FDB713] text-[#000000] rounded-lg hover:bg-[#e6a500] hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer">
              <button className="font-bold text-[16px] md:text-[18px] lg:text-[20px] whitespace-nowrap">
                رزرو آسان خودرو
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanerHeader;
