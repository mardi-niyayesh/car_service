import { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";

type ProductType = {
  id: string;
  name: string;
  price_per_day: number;
  description: string;
  can_rent: boolean;
  tags: string[];
  company: string;
  slug: string;
  image: string;
  rate: number;
};
export const useProduct = (page = 1, limit = 10) => {
  const [totalPage, setTotalPage] = useState(5);
  const [allProduct, setAllProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchAllProduct = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `cars?page=${page}&limit=${limit}&order=desc&order_by_field=created_at`,
      );
      const AllProduct = response.data.response.data.cars;
      console.log("responst to get All Products :", AllProduct);
      setAllProduct(AllProduct);

      const totlalItem = response.data.response.data.count;
      console.log("total items product", totlalItem);

      const CountItem = Math.ceil(totlalItem / 5);

      setTotalPage(CountItem);
    } catch (err) {
      console.log("Error in Gt All Products :", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllProduct();
  }, [page, limit]);
  return { allProduct, loading, totalPage, refetch: fetchAllProduct };
};
