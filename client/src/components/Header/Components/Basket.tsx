import { MdOutlineShoppingCart } from "react-icons/md";

const Basket = () => {
  return (
    <div
      className="inline-flex cursor-pointer items-center justify-between  py-2 w-auto rounded-lg
                   bg-white md:hover:bg-[#137cfd] transition duration-300 ease-in-out
                   group
                   sm:justify-center sm:px-2 
                   md:border-2 md:border-blue-600" 
    >
      <MdOutlineShoppingCart
        size={30}
        className="text-blue-600 md:group-hover:text-white transition duration-300 ease-in-out
                   sm:size={24}"
      />

      <button className="text-blue-600 hidden md:block md:px-1  font-medium group-hover:text-white transition duration-300 ease-in-out">
        سبد خرید
      </button>
    </div>
  );
};

export default Basket;
