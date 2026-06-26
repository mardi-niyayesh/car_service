import ResentReseve from "../components/Dashboard/ResentReseve";
const ReservePages = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 min-h-screen bg-white">
        <div className="w-full md:flex-1">
          <div className=" border border-[#EDEDED] rounded-xl bg-yellow-100 shadow-sm sm:gap-0 p-3 sm:p-4  ">
            <p className="text-yellow-800 text-[22px] font-bold  text-center">
              رزروهای جاری من
            </p>
          </div>
          <ResentReseve />
        </div>
      </div>
    </>
  );
};

export default ReservePages;
