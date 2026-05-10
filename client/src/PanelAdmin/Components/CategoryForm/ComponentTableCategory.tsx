import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import ComponentPaginat from "../../../ComponentPublic/ComponentPaginat";
import SuccessModal from "../../../components/common/SuccessModal";
import WarningModal from "../../../components/common/WarningModal ";
import { useUser } from "../../../hooks/useUser";
type CategoryType = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

const ComponentTableCategory = (): React.ReactElement => {
  const { hasRole, hasPermission } = useUser();
  const navigate = useNavigate();
  const [getcat, setGetcat] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

const hasDeletePermission = hasPermission("category.delete") || hasRole("category_manager");
const hasUpdatePermission = hasPermission("category.update") || hasRole("category_manager");


  const GetAllCategory = async () => {
    try {
      const resCat = await axiosClient.get(
        `/categories?page=${page}&limit=5&order=desc`,
      );
      const Allcat = resCat.data.response.data.categories;
      const count = resCat.data.response.data.count;

      const tota = Math.ceil(count / 5);
      setTotalPage(tota);
      console.log("response to grt all category :", Allcat);
      setGetcat(Allcat);
    } catch (err) {
      console.log("Error in fetch All category :", err);
    }
  };
  useEffect(() => {
    GetAllCategory();
  }, [page]);

  const handleDeleatCategory = async (CategoryId: string) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;
    try {
      const response = await axiosClient.delete(`/categories/${CategoryId}`);
      console.log("response to deleat category : ", response);
      setIsSuccessOpen(true);
      setSuccessMessage("دسته بندی با موفقیت حذف شد");
      GetAllCategory();
    } catch (err) {
      console.log("error in deleat category :", err);
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage(
          "شما مجوز لازم برای حذف دسته بندی را ندارید فقط سازنده دسته بندی یا owner قابلیت حذف دسته بندی را دارند",
        );
      } else if (err.response?.status === 404) {
        setIsWarningOpen(true);
        setWarningMessage(
          "این دسته‌بندی قبلاً حذف شده است لطفا صفحه رو رفرش کنید",
        );
      } else {
        setIsWarningOpen(true);
        setWarningMessage("خطا در حذف دسته بندی مجدد تلاش کنید");
      }
    }
  };
  const handleupdatCategory = (id: string) => {
    navigate(`/panel/category/update/${id}`);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full  text-right text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="w-12 px-4 py-3 font-medium hidden sm:table-cell ">
                ردیف
              </th>
              <th className="w-32 px-4 py-3 font-medium"> دسته بندی </th>
              <th className="w-56 px-4 py-3 font-medium hidden sm:table-cell">
                توضیحات
              </th>
              {hasDeletePermission && (
                <th className="w-56 px-4 py-3 font-medium">حذف</th>
              )}
              {hasUpdatePermission && (
                <th className="w-56 px-4 py-3 font-medium">آپدیت</th>
              )}

              <th className="w-56 px-4 py-3 font-medium">لینک</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {getcat.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 hidden sm:table-cell">{index + 1}</td>
                <td className="px-4 py-3 text-green-500">{cat.name}</td>
                <td className="px-4 py-3 font-medium hidden sm:table-cell">
                  {cat.description ? cat.description : "____"}
                </td>
                {hasDeletePermission && (
                  <td>
                    {
                      <RiDeleteBinLine
                        size={20}
                        color="red"
                        opacity={0.8}
                        className="cursor-pointer"
                        onClick={() => handleDeleatCategory(cat.id)}
                      />
                    }
                  </td>
                )}
                {hasUpdatePermission && (
                  <td>
                    {
                      <FaPencilAlt
                        size={20}
                        color="blue"
                        opacity={0.5}
                        className="cursor-pointer"
                        onClick={() => handleupdatCategory(cat.id)}
                      />
                    }
                  </td>
                )}

                <td className="inline-block font-medium m-2  text-gray-700 text-xs px-2 py-1 rounded m-0.5">
                  {cat.slug}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        message={warningMessage}
      />
    </div>
  );
};

export default ComponentTableCategory;
