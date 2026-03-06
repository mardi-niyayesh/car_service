//components
import ComponentsPanelAdmin from "../ComponentsPanelAdmin";
const UsersPage = () => {
  return (
 
      <div  className="flex flex-col md:flex-row  md:gap-4 p-3 md:p-4 min-h-screen bg-white">
        {/*Components PanelAdmin */}
        <div className=" md:block md:w-64 lg:w-72 xl:w-80">
          <ComponentsPanelAdmin />
        </div>

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
              <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md">
                کاربران
              </button>

              <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
                <span> کاربران مدیر</span>
                {/* <img
                  src={ticcircle}
                  alt="ticcircle"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                /> */}
              </button>

              <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
                <span> کاربران مسدود</span>
                {/* <img
                  src={timer}
                  alt="timer"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                /> */}
              </button>
              <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2]  transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2">
                <span> همه کاربران </span>
                {/* <img
                  src={ticcircle}
                  alt="ticcircle"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                /> */}
              </button>
            </div>
          </div>
          <div dir="rtl" className="p-4">
            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
              <table className="min-w-full  text-right text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700 ">
                  <tr>
                    <th className="w-12 px-4 py-3 font-medium">ردیف</th>
                    <th className="w-32 px-4 py-3 font-medium">کاربر</th>
                    <th className="w-56 px-4 py-3 font-medium">ایمیل</th>
                    <th className="w-20 px-4 py-3 font-medium">نقش</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-300 transition-colors">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3">niya</td>
                    <td className="px-4 py-3">niya@gmail.com</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      ادمین
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-300 transition-colors">
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3">maryam</td>
                    <td className="px-4 py-3">maryam@gmail.com</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      کاربر
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-300 transition-colors">
                    <td className="px-4 py-3">3</td>
                    <td className="px-4 py-3">zahra</td>
                    <td className="px-4 py-3 truncate">zahra@gmail.com</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      ادمین
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-300 transition-colors">
                    <td className="px-4 py-3">4</td>
                    <td className="px-4 py-3">nimaa</td>
                    <td className="px-4 py-3 truncate">nimaa@gmail.com</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      کاربر
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default UsersPage;
