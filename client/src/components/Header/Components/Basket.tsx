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
        className="inline-flex items-center justify-center gap-2
                   px-2 py-2 sm:px-3 md:px-5
                   rounded-full md:rounded-lg
                   bg-[#FDB713]                  
                   text-white
                   hover:bg-yellow-600             
                   transition-all duration-300 ease-in-out
                   border border-yellow-500/30   
                   md:border-0                  
                   hover:scale-105 md:hover:scale-100
                   active:scale-95
                   group"
      >
        <div className="relative">
          <MdOutlineShoppingCart
            size={24}
            className="text-white transition-transform duration-300 group-hover:scale-110"
          />

          {countitem > 0 && (
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center
                         bg-red-500 text-white text-[10px] font-bold rounded-full
                         min-w-[18px] h-[18px] px-1
                         ring-2 ring-white"
            >
              {countitem > 99 ? "99+" : countitem}
            </span>
          )}
        </div>

        <span className="hidden md:inline font-medium text-sm lg:text-base">
          سبد خرید
        </span>
      </div>
    </Link>
  );
};

export default Basket;
