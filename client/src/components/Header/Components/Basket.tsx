import { MdOutlineShoppingCart } from "react-icons/md";
const Basket = () => {
  return (
    <div
      className="inline-flex items-center justify-between border-2 border-blue-600 gap-2 px-4 py-2 w-auto rounded-lg 
                   bg-white hover:bg-[#137cfd]  transition duration-300 ease-in-out 
                   group"
    >
      <MdOutlineShoppingCart
        size={30}
        className="text-blue-600 group-hover:text-white transition duration-300 ease-in-out"
      />

      <button className="text-blue-600 group-hover:text-white transition duration-300 ease-in-out">
        سبد خرید
      </button>
    </div>
  );
};

export default Basket;
