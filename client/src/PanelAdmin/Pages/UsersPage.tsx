import ComponentTableUser from "../Components/ComponentTableUser";

const UsersPage = () => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  p-3 sm:p-4">
          <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold">
            کاربران
          </p>
        </div>

        <div dir="rtl" className="p-4">
          <ComponentTableUser />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
