import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosClient";

const Basket = () => {
  const [countitem, setCountItem] = useState(0);

  const fetchAllReserve = async () => {
    try {
      const response = await axiosClient.get(`/carts`);
      const cartData = response.data.response.data.cart;
      const numberOfCars = cartData?.carRents?.length || 0;
      setCountItem(numberOfCars);
    } catch (err) {
      console.log("Error in get basket :", err);
      setCountItem(0);
    }
  };

  useEffect(() => {
    fetchAllReserve(); 

    const handleCartUpdate = () => {
      fetchAllReserve(); 
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return (
    <Link to="/basket">
      <div
        className="relative inline-flex cursor-pointer items-center justify-between py-2 w-auto rounded-lg
                   bg-white md:hover:bg-[#FDB713] transition duration-300 ease-in-out group
                   sm:justify-center sm:px-2 md:border-2 md:border-[#FDB713]"
      >
        <div className="relative">
          <MdOutlineShoppingCart
            size={30}
            className="text-[#FDB713] md:group-hover:text-white transition duration-300 ease-in-out
                       sm:size={24}"
          />

          {countitem > 0 && (
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center
                         bg-yellow-600 text-white text-xs font-bold rounded-full
                         w-5 h-5"
            >
              {countitem}
            </span>
          )}
        </div>

        <button className="text-yellow-600 font-bold hidden md:block md:px-1 font-medium group-hover:text-white transition duration-300 ease-in-out">
          سبد خرید
        </button>
      </div>
    </Link>
  );
};

export default Basket;
