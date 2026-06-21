import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import { useUser } from "../../../hooks/useUser";
import { useCategories } from "../../../hooks/useCategories";

const ComponentTableCategory = (): React.ReactElement => {
  const { hasRole, hasPermission } = useUser();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const { categories, totalCount, refetch } = useCategories(page, 5);
  const totalPage = Math.ceil(totalCount / 5);

  const hasDeletePermission =
    hasPermission("category.delete") || hasRole("category_manager");
  const hasUpdatePermission =
    hasPermission("category.update") || hasRole("category_manager");

  const handleDeleatCategory = async (CategoryId: string) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;
    try {
      const response = await axiosClient.delete(`/categories/${CategoryId}`);
      console.log("response to deleat category : ", response);
      setIsSuccessOpen(true);
      setSuccessMessage("دسته بندی با موفقیت حذف شد");
      refetch();
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
      } else if (err.response?.status === 409) {
        setIsWarningOpen(true);
        setWarningMessage(
          "اول باید تمام ماشین که با این کتگوری ساخته شدن رو حذف کنید یا کتگوری ایدی ماشین ها رو تغییر بدید بعد میتوانید کتگوری را حذف کنید",
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
              <th className="w-12 px-4 py-3  hidden sm:table-cell ">ردیف</th>
              <th className="w-32 px-4 py-3 "> دسته بندی </th>
              <th className="w-56 px-4 py-3 hidden sm:table-cell">توضیحات</th>

              {hasDeletePermission && <th className="w-56 px-4 py-3 ">حذف</th>}
              {hasUpdatePermission && (
                <th className="w-56 px-4 py-3 ">آپدیت</th>
              )}

              <th className="w-56 px-4 py-3 ">لینک</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat, index) => (
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

                <td className="px-4 py-3 text-gray-700 text-xs">{cat.slug}</td>
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
