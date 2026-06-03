import { useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { useState } from "react";
type CarType = {
  name: string;
  company: string;
  price_per_day: string;
  image: string;
  description: string;
};
type carRentsType = {
  id: string;
  price: number;
  status: string;
  start_date: string;
  end_date: string;
  car: CarType;
};
type ReserveType = {
  id: string;
  img: string;
  total_price: number;
  carRents: carRentsType;
};
const BasketComponent = () => {
  const [dataReserve, setDataReserve] = useState([]);
  const fetchAllReserve = async () => {
    try {
      const response = await axiosClient.get(`/carts`);
      const AllReserve = response.data.response.data.cart.carRents;
      console.log("All reserve to Basket :", AllReserve);
      setDataReserve(AllReserve);
    } catch (err) {
      console.log("Error in get basket :", err);
    }
  };
  useEffect(() => {
    fetchAllReserve();
  }, []);
  return (
    <>
      <div>
        <div>
          {dataReserve.map((res: ReserveType) => (
            <div key={res.id}>
             <p>{res.total_price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BasketComponent;
