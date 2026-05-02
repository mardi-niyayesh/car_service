// img icons
import ticcircle from "../../../assets/tick-circle.png";
import timer from "../../../assets/timer.png";

const CommentPages = () => {
  return (
  
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {/* title Pages*/}
        <div className="mb-6 md:mb-8">
          <p className="text-[#212121] text-xl sm:text-2xl md:text-3xl font-bold pb-3 inline-block">
            نظرات من
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
          {/* All comments*/}
          <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md">
            همه نظرات
          </button>

          {/* Approved Comments*/}
          <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
            <span>نظرات تایید شده</span>
            <img
              src={ticcircle}
              alt="ticcircle"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </button>

          {/* pendding comments*/}
          <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
            <span>در انتظار تایید</span>
            <img src={timer} alt="timer" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* defulte comments*/}
        <div className="space-y-4">
          {/* defulte comments 1*/}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <img
                src={timer}
                alt="timer"
                className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0"
              />
              <p className="text-[#5E5E5E] text-sm sm:text-base">
                ماشین موردعلاقم ناموجود بود. چرا خب؟
              </p>
            </div>
            <p className="text-[#868686] text-sm sm:text-base bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200 w-fit sm:w-auto">
              در انتظار تایید
            </p>
          </div>

          {/* defulte comments 2*/}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <img
                src={ticcircle}
                alt="ticcircle"
                className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0"
              />
              <p className="text-[#5E5E5E] text-sm sm:text-base">
                بهترین تجربه جذابی با پورشه داشتم.دمتون گرم
              </p>
            </div>
            <p className="text-[#868686] text-sm sm:text-base bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 w-fit sm:w-auto">
              تایید شده
            </p>
          </div>
        </div>
      </div>

  );
};

export default CommentPages;
