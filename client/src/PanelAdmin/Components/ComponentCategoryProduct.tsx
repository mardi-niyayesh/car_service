const ComponentCategoryProduct = () => {
  return (
    <div className="flex  gap-4 ">
      <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
        <div className="flex items-center gap-2">
          <span> محصولات رایگان</span>
        </div>
      </button>
      <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#e2a54a] hover:text-[#e2a54a] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
        <div className="flex items-center gap-2">
          <span> محصولات غیررایگان </span>
        </div>
      </button>
      <button className="bg-white text-[#9A9A9A] text-sm sm:text-base font-medium px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#C2C2C2] rounded-xl hover:border-[#16a571] hover:text-[#16a571] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 justify-between ">
        <div className="flex items-center gap-2">
          <span> همه محصولات </span>
        </div>
      </button>
    </div>
  );
};

export default ComponentCategoryProduct;
