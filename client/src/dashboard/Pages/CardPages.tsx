//img
import carimg from "../../../assets/pic.png";

const CardPages = () => {
  return (
    
      <div className="w-full md:flex-1">
        {/* header Card */}

        <p className="text-[#212121] text-[14px] sm:text-[16px] md:text-[18px] font-bold">
          پرداخت های من
        </p>

        {/* list Cards */}
        <div className="mt-4 w-full">
          {/* Card Item */}
          <div className="p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white hover:shadow-md transition-all duration-200 w-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* information car*/}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={carimg}
                      alt="carimg"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[#353535] font-medium text-[14px] md:text-[16px]">
                      لکسوس (Lexus IS 300)
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="text-[12px] md:text-[13px] font-medium">
                        <span className="text-[#AEAEAE] ml-1">مدل:</span>
                        <span className="text-[#494949]">2024</span>
                      </div>
                      <div className="text-[12px] md:text-[13px] font-medium">
                        <span className="text-[#AEAEAE] ml-1">مدت:</span>
                        <span className="text-[#494949]">3 روز</span>
                      </div>
                    </div>

                    <div>
                      <span className="inline-block px-4 py-2 bg-[#269E22]/10 text-[#269E22] text-[13px] md:text-[14px] font-bold rounded-lg">
                        پرداخت موفق
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* detail Payment*/}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-[#AEAEAE] text-[12px] md:text-[13px] font-medium whitespace-nowrap">
                    شناسه پرداخت:
                  </span>
                  <span className="text-[#494949] text-[12px] md:text-[13px] font-medium">
                    ۱۳۷۵۹۴۷۶۹۷
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-[#AEAEAE] text-[12px] md:text-[13px] font-medium whitespace-nowrap">
                    شماره حساب:
                  </span>
                  <span className="text-[#494949] text-[12px] md:text-[13px] font-medium">
                    ۰۱۷۸۷۹۴۶۹۳۵۰۳۴۷۷
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-[#AEAEAE] text-[12px] md:text-[13px] font-medium whitespace-nowrap">
                    دارنده حساب:
                  </span>
                  <span className="text-[#494949] text-[12px] md:text-[13px] font-medium">
                    اتورنت گستر ایرانیان
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default CardPages;
