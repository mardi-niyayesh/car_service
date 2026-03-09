//components
import ComponentTableUser from "../Components/ComponentTableUser";

const UsersPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        {/* header User*/}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
          <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold">
            کاربران
          </p>
        </div>

        {/* category Users*/}
        <div className="flex-1 ">
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
            <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
              <span> کاربران مدیر</span>
            </button>

            <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
              <span> کاربران مسدود</span>
            </button>
            <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2]  transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
              <span> همه کاربران </span>
            </button>
          </div>
        </div>
        {/*Components TableUser */}
        <div dir="rtl" className="p-4">
          <ComponentTableUser />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
