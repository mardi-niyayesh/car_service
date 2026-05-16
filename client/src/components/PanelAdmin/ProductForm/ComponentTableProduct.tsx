import { useUser } from "../../../hooks/useUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import { useEffect, useState } from "react";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import { useCallback } from "react";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import { useNavigate } from "react-router-dom";

type ProductType = {
  id: string;
  name: string;
  price_per_day: number;
  description: string;
  can_rent: boolean;
  tags: string[];
  company: string;
  slug: string;
};

const ComponentTableProduct = () => {
  const navogate=useNavigate()
  const [allProduct, setAllProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const { hasRole, hasPermission } = useUser();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [isErroOpen, setIsErroOpen] = useState(false);
  const [ErroMessage, setErroMessage] = useState("");

  const hasDeleteProduct =
    hasPermission("product.delete") || hasRole("product_manager");

  const hasUpdateProduct =
    hasPermission("product.update") || hasRole("product_manager");

  const fetchAllProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `cars?page=${page}&limit=5&order=desc&order_by_field=created_at`,
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
  }, [page]);

  useEffect(() => {
    fetchAllProduct();
  }, [page, fetchAllProduct]);

  const handleDeleatProduct = async (id: string) => {
    try {
      const response = await axiosClient.delete(`/cars/${id}`);
      if (response.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("محصول مورد نظر با موفقیت حذف شد .");
        fetchAllProduct();
      }
    } catch (err) {
      console.log("Error in deleat Product : ", err);
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          "شما مجوز لازم ( یا owner or product.delel) باید داشته باشید",
        );
      } else if (err.response?.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "محصولی که قصد حذف کردنش را دارید در دیتابیس وجود ندارد",
        );
      } else {
        setIsErroOpen(true);
        setErroMessage(" متاسفیم! خطایی در سرور رخ داده است");
      }
    }
  };
  const handleupdatProduct = async (id: string) => {
   navogate(`updateproduct/${id}`)
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        {loading ? (
          <p className="text-center text-gray-500 py-8">
            در حال گرفتن همه محصولات ...
          </p>
        ) : (
          <table className="min-w-full  text-right text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 ">
              <tr>
                <th className="w-12 px-4 py-3 font-medium hidden sm:table-cell">
                  ردیف
                </th>
                <th className="w-32 px-4 py-3 font-medium">عنوان </th>
                <th className="w-56 px-4 py-3 font-medium">قیمت</th>
                <th className="w-20 px-4 py-3 font-medium hidden sm:table-cell">
                  کمپانی
                </th>
                <th className="w-20 px-4 py-3 font-medium hidden sm:table-cell">
                  لینک
                </th>
                {hasDeleteProduct && (
                  <th className="w-20 px-4 py-3 font-medium"> حذف</th>
                )}
                {hasUpdateProduct && (
                  <th className="w-20 px-4 py-3 font-medium"> اپدیت</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProduct?.map((product, index) => {
                return (
                  <tr
                    className="hover:bg-gray-300 transition-colors"
                    key={product.id}
                  >
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">{product.name} </td>
                    <td className="px-4 py-3">{product.price_per_day}</td>
                    <td className="px-4 py-3 text-blue-400 font-medium hidden sm:table-cell">
                      {product.company}
                    </td>
                    <td className="px-4 py-3 text-blue-400 font-medium hidden sm:table-cell">
                      {product.slug}
                    </td>

                    {hasDeleteProduct && (
                      <td>
                        {
                          <RiDeleteBinLine
                            size={20}
                            color="red"
                            opacity={0.8}
                            className="cursor-pointer"
                            onClick={() => handleDeleatProduct(product.id)}
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
                            onClick={() => handleupdatProduct(product.id)}
                          />
                        }
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ComponentPaginat
        currentPage={page}
        totalPages={totalPage}
        onPageChange={setPage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={WarningMessage}
      />
      <ErrorModal
        isOpen={isErroOpen}
        onClose={() => setIsErroOpen(false)}
        message={ErroMessage}
      />
    </>
  );
};

export default ComponentTableProduct;
