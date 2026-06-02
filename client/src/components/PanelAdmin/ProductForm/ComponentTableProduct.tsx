import { useUser } from "../../../hooks/useUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt, FaImage, FaRegComment } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import { useState } from "react";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../../hooks/useProduct";
import ComponentTableComment from "../../CommentForm/ComponentTableComment";

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

  const hasUpdateProfile =
    hasPermission(["product.update", "product.create"]) ||
    hasRole("product_manager");

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

  const handleupdatProfile = async (slug: string) => {
    navigate(`updateImg/${slug}`);
  };
  const handleShowComment = async (id: string) => {
    navigate(`commentoneproduct/${id}`);
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
                {hasUpdateProfile && (
                  <th className="w-20 px-4 py-3 font-medium"> عکس</th>
                )}
                {hasViewComment && (
                  <th className="w-20 px-4 py-3 font-medium"> کامنت</th>
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
                            size={18}
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
                            size={18}
                            color="blue"
                            opacity={0.5}
                            className="cursor-pointer"
                            onClick={() => handleupdatProduct(product.slug)}
                          />
                        }
                      </td>
                    )}

                    {hasUpdateProfile && (
                      <td>
                        {
                          <FaImage
                            size={18}
                            color="green"
                            opacity={0.5}
                            className="cursor-pointer"
                            onClick={() => handleupdatProfile(product.id)}
                          />
                        }
                      </td>
                    )}
                    {hasViewComment && (
                      <td>
                        {
                          <FaRegComment
                            size={18}
                            className="cursor-pointer"
                            onClick={() => handleShowComment(product.id)}
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
