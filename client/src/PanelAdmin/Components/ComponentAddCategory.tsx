import axiosClient from "../../services/axiosClient";
import { useState } from "react";
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";
const ComponentAddCategory = () => {
  const [checkOwnership, setCheckOwnership] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  const CreateCategory = async () => {
    try {
      const response = await axiosClient.post(`/categories`, {
        name: categoryName,
        description: categoryDescription,
        slug: categorySlug,
        ownership: checkOwnership,
      });
      console.log("responst to creat category :", response.data);
      setSuccessMessage("دسته بندی جدید با موفقیت ساخته شد");
      setCategoryName("");
      setCategoryDescription("");
      setCategorySlug("");
      setCheckOwnership(false);
    } catch (err) {
      console.log("Error in creat new category :", err);
      setWarningMessage("لطفا مجدد تلاش کنید");
    }
  };
  const handleOwnerShip = (e) => {
    setCheckOwnership(e.target.checked);
    console.log("ownership : ", e.target.checked);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setWarningMessage("");
  };
  return (
    <>
      <form
        className="border border-[#EDEDED] rounded-xl bg-white shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="p-6 bg-white">
          <p className="text-[#4b33b5] text-[20px] sm:text-[20px] md:text-[20px] font-bold mb-4">
            فرم اضافه کردن دسته بندی
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام دسته بندی <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setCategoryName(e.target.value)}
                type="text"
                placeholder=" نام..."
                className="w-full px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات دسته بندی
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              </label>
              <input
                onChange={(e) => setCategoryDescription(e.target.value)}
                type="text"
                placeholder="توضیحات... "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لینک دسته بندی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="لینک..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              <p className="text-xs text-gray-400 mt-1">
                فقط حروف کوچک انگلیسی، اعداد و خط تیره
              </p>
            </div>

            <div className="flex gap-2 items-center justify-start">
              <div className="flex items-center">
                <input type="checkbox" onClick={handleOwnerShip} />
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مالکیت (Ownership)
              </label>
            </div>
          </div>
          <button
            type="submit"
            className=" py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
          >
            اضافه کردن دسته بندی
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={WarningMessage}
      />
    </>
  );
};

export default ComponentAddCategory;
