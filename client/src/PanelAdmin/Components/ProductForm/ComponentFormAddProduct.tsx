const ComponentFormAddProduct = () => {
  return (
    <form className="border border-[#EDEDED] rounded-xl bg-white shadow-sm">
      <div className="p-6 bg-white">
        <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
          فرم اضافه کردن محصولات
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان محصول
            </label>
            <input
              type="text"
              placeholder=" عنوان..."
              className="w-full px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات محصول
            </label>
            <input
              type="text"
              placeholder="توضیحات... "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              لینک محصول
            </label>
            <input
              type="text"
              placeholder="لینک..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              قیمت محصول
            </label>
            <input
              type="text"
              placeholder=" قیمت..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته بندی محصول
            </label>
            <input
              type="text"
              placeholder=" دسته بندی..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اپلود عکس محصول
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-lg  text-sm text-blue-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              محصول رایگان
            </label>
            <div className="flex items-center">
              <input type="checkbox" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className=" py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
        >
          اضافه کردن محصول
        </button>
      </div>
    </form>
  );
};

export default ComponentFormAddProduct;
