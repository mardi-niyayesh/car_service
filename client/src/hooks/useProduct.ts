import { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import { type ProductFormType } from "../components/PanelAdmin/ProductForm/ProductFormComponent";

export const useProduct = (
  page = 1,
  limit = 10,
  category?: string,
) => {
  const [totalPage, setTotalPage] = useState(0);
  const [allProduct, setAllProduct] = useState<ProductFormType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProduct = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        order: "desc",
        order_by_field: "created_at",
      });

      // فقط اگر category وجود داشت فیلترش کن
      if (category) {
        params.append("category", category);
      }

      const response = await axiosClient.get(`/cars?${params.toString()}`);

      const data = response.data.response.data;

      setAllProduct(data.cars);

      const totalItems = data.count;
      const countPage = Math.ceil(totalItems / limit);

      setTotalPage(countPage);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setAllProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, [page, limit, category]);

  return {
    allProduct,
    loading,
    totalPage,
    refetch: fetchAllProduct,
  };
};