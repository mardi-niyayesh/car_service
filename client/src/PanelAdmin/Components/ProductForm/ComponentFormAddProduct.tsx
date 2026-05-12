import TagInput from "./TagInput";
import { useState } from "react";
import { Link } from "react-router-dom";
const ComponentFormAddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    company: "",
    price_per_day: 0,
    tags: [],
    description: "",
    can_rent: true,
    ownership: false,
    category_id: "",
  });
  return (
    <>
      <form className="border border-[#EDEDED] rounded-xl bg-white shadow-sm">
        <div className="p-6 bg-white">
          <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
            فرم اضافه کردن ماشین
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم ماشین<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                placeholder=" عنوان..."
                className="w-full px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات ماشین <span className="text-gray-400">(اختیاری)</span>
              </label>
              <input
                type="text"
                placeholder="توضیحات... "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
            <TagInput
              value={formData.tags}
              onChange={(newTags) =>
                setFormData({ ...formData, tags: newTags })
              }
              placeholder="مثال: سدان, خانوادگی, کم مصرف"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کمپانی ماشین<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                placeholder="کمپانی... "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لینک ماشین <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                placeholder="لینک..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قیمت ماشین<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                placeholder=" قیمت..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ایدی دسته بندی ماشین<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                placeholder="آیدی دسته بندی..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اپلود عکس ماشین
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-lg  text-sm text-blue-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm "
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked={true}
              />
              <label className="block text-sm font-medium text-gray-700">
                آیا ماشین قابل اجاره است؟
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="block text-sm font-medium text-gray-700">
                مالکیت (Ownership)
              </label>
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
      <Link to="/panel/category">
        <p className="text-blue-800 mt-3 hover:text-blue-600">
          برای دریافت ایدی هر دسته بندی کلیک کنید
        </p>
      </Link>
    </>
  );
};

export default ComponentFormAddProduct;
