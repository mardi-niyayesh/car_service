const ComponentFormUpdateUser = () => {
  return (
    <form className="border border-[#EDEDED] rounded-xl bg-white shadow-sm">
      <div className="p-6 bg-white">
        <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
          فرم ویرایش کاربر
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کامل
            </label>
            <input
              type="text"
              placeholder="کاربر جدید"
              className="w-full px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ایمیل کاربر
            </label>
            <input
              type="email"
              placeholder="ایمیل کاربر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              سن کاربر
            </label>
            <input
              type="tel"
              placeholder="سن کاربر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ادرس کاربر
            </label>
            <input
              type="text"
              placeholder=" ادرس کاربر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نقش کاربر
            </label>
            <input
              type="text"
              id="role"
              value={"کاربر"}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آپلود پروفایل
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg  text-sm text-blue-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm "
            />
          </div>
        </div>
        <button
          type="submit"
          className=" py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
        >
          ثبت اطلاعات
        </button>
      </div>
    </form>
  );
};

export default ComponentFormUpdateUser;
