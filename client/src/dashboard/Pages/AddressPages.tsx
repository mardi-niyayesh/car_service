//icon
import locationadd from "../../../assets/location-add.png";

const AddressPages = () => {
  return (
   
      <div className="w-full md:flex-1">
        {/* header Address*/}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white shadow-sm">
          <p className="text-[#212121] text-[14px] sm:text-[16px] md:text-[18px] font-bold">
            آدرس‌های من
          </p>

          {/* button new Address in mobile*/}
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto cursor-pointer bg-blue-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <img
              src={locationadd}
              alt="locationadd"
              className="w-4 h-4 md:w-5 md:h-5"
            />
            <p className="text-[#194BF0] text-[14px] md:text-[16px] font-medium whitespace-nowrap">
              ثبت آدرس جدید
            </p>
          </div>
        </div>

        {/* list Address*/}
        <div className="mt-4 w-full">
          {/* defult Address*/}
          <div className="p-3 sm:p-4 border border-[#EDEDED] rounded-xl bg-white hover:shadow-md transition-all duration-200 w-full">
            <div className="flex flex-col xs:flex-row justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#212121] text-[14px] sm:text-[16px]">
                  آدرس
                </p>
                <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  پیش‌فرض
                </span>
              </div>
              <div className="flex items-center gap-3 w-full xs:w-auto justify-end">
                <button className="text-blue-600 text-xs sm:text-sm cursor-pointer hover:font-bold transition-all duration-200">
                  ویرایش
                </button>
                <button className="text-red-500 text-xs sm:text-sm cursor-pointer hover:font-bold transition-all duration-200">
                  حذف
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              تهران، شهرک غرب، بلوار فرحزادی، خیابان سپیدار، پلاک ۴۵
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-500">کد پستی:</span>
                ۵۵۴۴۳۳۲۲۱۱
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-500"> ایمیل:</span>
                test@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default AddressPages;
