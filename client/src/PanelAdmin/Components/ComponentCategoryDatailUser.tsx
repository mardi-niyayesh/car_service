//icon for react-icon
import { FaUser } from "react-icons/fa";
import { HiUserGroup, HiShoppingCart, HiCake,HiMail } from 'react-icons/hi';

const ComponentCategoryDatailUser = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
          <div className="flex items-center gap-2">
           <FaUser style={{ opacity: 0.6 }} />
            <span> نام کاربر:</span>
          </div>
          <span>test</span>
        </button>

        <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
          <div className="flex items-center gap-2">
            <HiMail size={20} style={{ opacity: 0.6 }} />
            <span> ایمیل کاربر:</span>
          </div>
          <span>test@gmail.com</span>
        </button>

        <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
          <div className="flex items-center gap-2">
            <HiUserGroup size={20} style={{ opacity: 0.6 }} />
            <span> نقش کاربر :</span>
          </div>
          <span>مدیر</span>
        </button>

        <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
          <div className="flex items-center gap-2">
             <HiCake size={20} style={{ opacity: 0.6 }} />
            <span>  سن کاربر:</span>
          </div>
          <span>1</span>
        </button>

        <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
          <div className="flex items-center gap-2">
            <HiShoppingCart size={20}/>
            <span> کل مبلغ خرید :</span>
          </div>
          <span>0 تومان </span>
        </button>
      </div>
    </div>
  );
};

export default ComponentCategoryDatailUser;
