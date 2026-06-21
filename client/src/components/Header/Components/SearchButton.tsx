import { FaSearch } from "react-icons/fa";
const SearchButton = () => {
  return (
    <div className="relative w-full md:w-[300px] lg:w-[500px] mx-auto my-2 md:my-0">
      <div className="relative flex items-center w-full gap-2 ">
        <button className=" md:flex absolute inset-y-0 left-0 ml-2 m-2 items-center hidden bg-[#FDB713] text-white font-medium text-sm md:text-[16px] px-4 py-3 md:py-4 rounded-[5px] hover:bg-yellow-600">
          جست و جو
        </button>

        <input
          type="email"
          placeholder="دنبال چی هستی؟..."
          className="bg-white text-black text-sm md:text-[14px] px-4 py-3 md:py-4 rounded-xl w-full border-2 border-yellow-500 pl-4 md:pl-20 pr-10 focus:outline-none focus:ring-0 focus:border-yellow-600"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaSearch className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
};

export default SearchButton;
