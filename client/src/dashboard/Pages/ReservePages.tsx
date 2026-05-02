const ReservePages = () => {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 min-h-screen bg-white">
      <div className="w-full md:flex-1">
        {/* title Reserve */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3  border border-[#EDEDED] rounded-xl bg-white shadow-sm sm:gap-0 p-3 sm:p-4  ">
          <p className="text-[#212121] text-[14px] sm:text-[16px] md:text-[18px] font-bold">
            رزروهای من
          </p>
          {/* filter Reserve */}
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto bg-blue-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <button className="px-4 py-2 text-[#08237D] text-[14px] md:text-[16px] font-medium whitespace-nowrap hover:bg-[#08237D] border-2 border-[#08237D] w-full hover:text-white rounded-lg transition-all duration-300">
              جاری
            </button>
            <button className="px-4 py-2 text-[#08237D] text-[14px] md:text-[16px] font-medium whitespace-nowrap hover:bg-[#08237D] border-2 border-[#08237D] w-full hover:text-white rounded-lg transition-all duration-300">
              انجام شده
            </button>
            <button className="px-4 py-2 text-[#08237D] text-[14px] md:text-[16px] font-medium whitespace-nowrap hover:bg-[#08237D] border-2 border-[#08237D] w-full hover:text-white rounded-lg transition-all duration-300">
              لغو شده
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservePages;
