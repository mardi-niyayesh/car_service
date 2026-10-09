import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosClient";

const Basket = () => {
  const [countitem, setCountItem] = useState(0);

  const fetchAllReserve = async () => {
    try {
      const response = await axiosClient.get("/carts");

      const cartData = response.data?.response?.data?.cart;
      const numberOfCars = cartData?.carRents?.length ?? 0;

      setCountItem(numberOfCars);
    } catch (err) {
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
    <Link
      to="/basket"
      aria-label={`سبد خرید${countitem > 0 ? `، ${countitem} خودرو` : ""}`}
      className="group inline-flex"
    >
      <div
        className="
          relative
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#FDB713]
          px-2.5
          py-2.5
          text-white
          border
          border-[#e5a500]/30
          shadow-sm
          transition-all
          duration-300
          ease-out
          hover:bg-[#e5a500]
          hover:shadow-md
          md:rounded-lg
          md:px-5
          
          active:scale-95
        "
      >
        <div className="relative flex items-center justify-center">
          <MdOutlineShoppingCart
            size={24}
            className="
              text-white
              transition-transform
              duration-300
              ease-out
              group-hover:scale-110
            "
          />

          {countitem > 0 && (
            <span
              className="
                absolute
                -right-2
                -top-2
                flex
                min-w-4.75
                h-4.75
                items-center
                justify-center
                rounded-full
                bg-white
                px-1
                text-[11px]
                font-extrabold
                leading-none
                text-[#d99a00]
                shadow-sm
                ring-2
                ring-[#FDB713]
                
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {countitem > 99 ? "99+" : countitem}
            </span>
          )}
        </div>

        <span
          className="
            hidden
            font-medium
            text-sm
            lg:inline
          "
        >
          سبد خرید
        </span>
      </div>
    </Link>
  );
};

export default Basket;
