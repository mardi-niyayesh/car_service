import { FaSearch } from "react-icons/fa";

const SearchButton = () => {
  return (
    <div className="relative w-full md:w-[250px] lg:w-[500px] mx-auto">
      <div className="relative flex items-center w-full gap-4">
        <button className="hidden md:flex absolute inset-y-0 left-0 ml-2 m-2 items-center bg-[#137cfd] text-white font-medium text-sm md:text-[16px] px-4 py-3 md:py-4 rounded-[5px] hover:bg-[#0d52a7]">
          جست و جو
        </button>

        <input
          type="email"
          placeholder="  دنبال چی هستی؟...  "
          className="bg-white text-black text-sm md:text-[14px] px-4 py-3 md:py-4 rounded-xl w-full border-2 border-gray-400 pl-4 md:pl-20 pr-10"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaSearch className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
};

export default SearchButton;
