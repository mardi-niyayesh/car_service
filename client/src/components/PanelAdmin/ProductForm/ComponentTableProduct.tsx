import { useUser } from "../../../hooks/useUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import { useEffect, useState } from "react";

const ComponentTableProduct = () => {
  const [allProduct, setAllProduct] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const { hasRole, hasPermission } = useUser();
  const hasDeleteProduct =
    hasPermission("product.delete") || hasRole("product_manager");
  const hasUpdateProduct =
    hasPermission("product.update") || hasRole("product_manager");

  const fetchAllProduct = async () => {
    const response = await axiosClient.get(
      `cars?page=1&limit=10&order=desc&order_by_field=created_at`,
    );
    console.log("responst to get All Products :", response);
  };
  useEffect(() => {
    fetchAllProduct();
  }, [page]);
  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full  text-right text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">ردیف</th>
              <th className="w-32 px-4 py-3 font-medium">عنوان </th>
              <th className="w-56 px-4 py-3 font-medium">قیمت</th>
              <th className="w-20 px-4 py-3 font-medium">دسته بندی</th>
              <th className="w-20 px-4 py-3 font-medium"> حذف</th>
              <th className="w-20 px-4 py-3 font-medium"> اپدیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-300 transition-colors">
              <td className="px-4 py-3">1</td>
              <td className="px-4 py-3">محصول 1</td>
              <td className="px-4 py-3">240000</td>
              <td className="px-4 py-3 text-blue-400 font-medium">دسته بندی</td>
            </tr>
            {hasDeleteProduct && (
              <td>
                {
                  <RiDeleteBinLine
                    size={20}
                    color="red"
                    opacity={0.8}
                    className="cursor-pointer"
                    // onClick={() => handleDeleatProduct(cat.id)}
                  />
                }
              </td>
            )}
            {hasUpdateProduct && (
              <td>
                {
                  <FaPencilAlt
                    size={20}
                    color="blue"
                    opacity={0.5}
                    className="cursor-pointer"
                    // onClick={() => handleupdatProduct(cat.id)}
                  />
                }
              </td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentTableProduct;
