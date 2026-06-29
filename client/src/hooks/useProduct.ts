import { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import { type ProductFormType } from "../components/PanelAdmin/ProductForm/ProductFormComponent";

export const useProduct = (page = 1, limit = 10) => {
  const [totalPage, setTotalPage] = useState(5);
  const [allProduct, setAllProduct] = useState<ProductFormType[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchAllProduct = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `cars?page=${page}&limit=${limit}&order=desc&order_by_field=created_at`,
      );
      const DataCar = response.data.response.data;
      const AllProduct = DataCar.cars;
      console.log("responst to get All Products :", AllProduct);
      setAllProduct(AllProduct);

      const totlalItem = DataCar.count;
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
