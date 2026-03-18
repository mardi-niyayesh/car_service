//icons for React-icon
import { MdLocationOn } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoArrowDown } from "react-icons/io5";
const HeroBaner = () => {
  return (
    <div className=" ">
      <div className=" text-center my-8 text-2xl font-bold text-blue-800">
        اجاره خودرو در ایران با کار سرویس
      </div>
      <form className="max-w-screen-lg container mx-auto mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 ">
          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              ایستگاه تحویل
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0  flex items-center  pr-4 ">
                  <MdLocationOn size={24} className="text-blue-800" />
                </div>
                <select className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 appearance-none w-full pr-10">
                  <option value="" disabled selected hidden></option>
                  <option value="tehran" selected>
                    تهران
                  </option>
                  <option value="shiraz">شیراز</option>
                  <option value="mashhad">مشهد</option>
                  <option value="karaj">کرج</option>
                  <option value="isfahan">اصفهان</option>
                  <option value="sari">ساری</option>
                  <option value="bushehr">بوشهر</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                  <IoArrowDown size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              نوع تحویل
            </label>
            <div className="relative flex-grow">
              <select className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none w-full">
                <option value="" disabled selected hidden></option>
                <option value="at-location" selected>
                  تحویل در محل
                </option>
                <option value="imam-airport">فرودگاه امام</option>
                <option value="mehrabad-airport">فرودگاه مهرآباد</option>
                <option value="azadi-hotel">هتل آزادی</option>
                <option value="esteglal-hotel">هتل استقلال</option>
                <option value="simorgh-hotel">هتل سیمرغ</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                <IoArrowDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              تاریخ تحویل
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0  flex items-center  pr-4">
                  <FaCalendarAlt size={24} className="text-blue-800 " />
                </div>
                <input
                  type="text"
                  className="flex-grow  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 appearance-none w-full pr-10"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              ساعت تحویل
            </label>
            <div className="relative flex-grow">
              <select className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none w-full">
                <option value="07:00" selected>
                  07:00
                </option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                <IoArrowDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              تاریخ بازگشت
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0  flex items-center   pr-4">
                  <FaCalendarAlt size={24} className="text-blue-800 " />
                </div>
                <input
                  type="text"
                  className="flex-grow  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 appearance-none w-full pr-10"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              ساعت بازگشت
            </label>
            <div className="relative flex-grow">
              <select className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none w-full">
                <option value="07:00" selected>
                  07:00
                </option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                <IoArrowDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <button className="bg-blue-800 w-full hover:bg-blue-700 md:w-auto text-center text-white p-3 rounded-lg font-medium flex items-center justify-center gap-1.5 m-auto">
          <FaSearch />
          خودروی مورد نظر را پیدا کنید
        </button>
      </form>
    </div>
  );
};

export default HeroBaner;
