import { useUser } from "../../../hooks/useUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt, FaRegComment } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import { useState } from "react";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../../hooks/useProduct";
import { FaEye } from "react-icons/fa";
const ComponentTableProduct = () => {
  const { loading, allProduct, refetch, totalPage } = useProduct();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
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

  const hasViewComment =
    hasPermission("comment.view") || hasRole("comment_manager");

  const handleDeleatProduct = async (id: string) => {
    try {
      const response = await axiosClient.delete(`/cars/${id}`);
      if (response.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("محصول مورد نظر با موفقیت حذف شد .");
        refetch();
      }
    } catch (err: any) {
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
    navigate(`updateproduct/${id}`);
  };

  const handleShowComment = async (id: string) => {
    navigate(`commentoneproduct/${id}`);
  };
  const handleShowDetailCar = async (slug: string) => {
    navigate(`/detailcar/${slug}`);
  };
  return (
    <>
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="mr-3 text-gray-500">در حال بارگذاری...</span>
          </div>
        ) : (
          <table className="min-w-full text-right text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="w-12 px-3 py-3.5 font-semibold text-gray-600 hidden sm:table-cell text-xs uppercase tracking-wider">
                  #
                </th>
                <th className="px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-[100px]">
                  عنوان
                </th>
                <th className="px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-[100px] hidden sm:table-cell">
                  قیمت
                </th>
                <th className="px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell min-w-[100px]">
                  کمپانی
                </th>
                <th className="px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell min-w-[100px]">
                  لینک
                </th>
                {hasDeleteProduct && (
                  <th className="w-14 px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                    حذف
                  </th>
                )}
                {hasUpdateProduct && (
                  <th className="w-14 px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                    ویرایش
                  </th>
                )}
                {hasViewComment && (
                  <th className="w-14 px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                    کامنت
                  </th>
                )}
                <th className="w-14 px-3 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                  مشاهده
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProduct?.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-yellow-50 transition-colors duration-150 group"
                >
                  <td className="px-3 py-3.5 text-gray-400 text-sm hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-3 py-3.5 text-gray-700 hidden sm:table-cell">
                    {product.price_per_day.toLocaleString()} تومان
                  </td>
                  <td className="px-3 py-3.5 text-blue-500 font-medium hidden md:table-cell">
                    {product.company}
                  </td>
                  <td className="px-3 py-3.5 text-gray-400 text-xs font-mono hidden lg:table-cell truncate max-w-[120px]">
                    {product.slug}
                  </td>

                  {hasDeleteProduct && (
                    <td className="px-3 py-3.5 text-center">
                      <RiDeleteBinLine
                        size={18}
                        className="text-red-400 hover:text-red-600 transition-colors duration-200 cursor-pointer mx-auto"
                        onClick={() => handleDeleatProduct(product.id)}
                      />
                    </td>
                  )}

                  {hasUpdateProduct && (
                    <td className="px-3 py-3.5 text-center">
                      <FaPencilAlt
                        size={16}
                        className="text-blue-400 hover:text-blue-600 transition-colors duration-200 cursor-pointer mx-auto"
                        onClick={() => handleupdatProduct(product.id)}
                      />
                    </td>
                  )}

                  {hasViewComment && (
                    <td className="px-3 py-3.5 text-center">
                      <FaRegComment
                        size={18}
                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 cursor-pointer mx-auto"
                        onClick={() => handleShowComment(product.id)}
                      />
                    </td>
                  )}

                  <td className="px-3 py-3.5 text-center">
                    <FaEye
                      size={18}
                      className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 cursor-pointer mx-auto"
                      onClick={() => handleShowDetailCar(product.slug)}
                    />
                  </td>
                </tr>
              ))}
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
