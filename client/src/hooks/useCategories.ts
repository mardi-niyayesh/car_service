import { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";

type CategoryType = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

export const useCategories = (page = 1, limit = 10) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/categories?page=${page}&limit=${limit}&order=desc`
      );
      const allCat = res.data.response.data.categories;
      const count = res.data.response.data.count;
      setCategories(allCat);
      setTotalCount(count);
    } catch (err) {
      console.log("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  return { categories, loaing, totalCount, refetch: fetchCategories };
};