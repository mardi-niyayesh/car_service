import ComponentPaginat from "../../Paginate/ComponentPaginat";
import { useState, useEffect } from "react";
import { FaCheck, FaTimesCircle } from "react-icons/fa";
import { useUser } from "../../hooks/useUser";
import axiosClient from "../../services/axiosClient";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { useParams } from "react-router-dom";
import { IoSyncOutline } from "react-icons/io5";

type User = {
  display_name: string;
};
type CommentType = {
  rate: number;
  id: string;
  content: string;
  user: User;
  created_at: string;
};
const ComponentTableComment = () => {
  const { hasPermission, hasRole } = useUser();
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allcomment, setAllComment] = useState<CommentType[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [activeTable, setActiveTable] = useState("pending");

  const hasReject =
    hasPermission("comment.reject") || hasRole("comment_manager");
  const hasConfirm =
    hasPermission("comment.confirm") || hasRole("comment_manager");

  const fetchAllComment = async () => {
    setLoading(true);

    try {
      const endpoint =
        activeTable === "pending"
          ? `/comments/unconfirmed?page=${page}&limit=10&order=desc&car=${id}`
          : `cars/${id}/comments?page=${page}&limit=10&order=desc`;

      const response = await axiosClient.get(endpoint);
      const { comments, count } = response.data.response.data;

      setAllComment(comments);
      const calculatedTotalPages = Math.ceil(count / 5);
      setTotalPages(calculatedTotalPages);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllComment();
  }, [page, activeTable]);

  const handleRejectComment = async (id: string) => {
    try {
      const responsive = await axiosClient.patch(`comments/${id}/reject`);
      if (responsive.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage(
          "کامنت مورد نظر با موفقیت ریجکت شد و از دیتابیس حذف شد",
        );
        fetchAllComment();
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "کامنت مورد نظر برای ریجکت کردن در دیتابیس یافت نشد لطفا صفحه رو رفرش کنید",
        );
      }
    }
  };
  const handleConfirmComment = async (id: string) => {
    try {
      const respoinse = await axiosClient.patch(`comments/${id}/confirm`);
      if (respoinse.status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("کامنت مورد نظر با موفقیت تایید شد");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "کامنت مورد نظر برای تایید کردن در دیتابیس یافت نشد لطفا صفحه رو رفرش کنید",
        );
      }
    }
  };
  const handleConfirmed = () => {
    setActiveTable("confirmed");
  };
  const handlePennding = () => {
    setActiveTable("pending");
  };
  return (
    <>
      <div className="w-full space-y-5">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleConfirmed}
            className={`
            group flex items-center justify-center gap-2.5
            rounded-xl border px-4 py-3
            text-sm font-semibold
            transition-all duration-200
            sm:px-5
            ${
              activeTable === "confirmed"
                ? "border-green-200 bg-green-50 text-green-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50/50 hover:text-green-700"
            }
          `}
          >
            <FaCheck
              size={15}
              className={`
              transition-transform duration-200
              ${
                activeTable === "confirmed"
                  ? "text-green-600"
                  : "text-gray-400 group-hover:text-green-600"
              }
            `}
            />

            <span>نظرات تایید شده</span>
          </button>

          <button
            type="button"
            onClick={handlePennding}
            className={`
            group flex items-center justify-center gap-2.5
            rounded-xl border px-4 py-3
            text-sm font-semibold
            transition-all duration-200
            sm:px-5
            ${
              activeTable === "pending"
                ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700"
            }
          `}
          >
            <IoSyncOutline
              size={17}
              className={`
              transition-transform duration-300
              ${
                activeTable === "pending"
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-blue-600"
              }
            `}
            />

            <span>نظرات در انتظار تایید</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

              <p className="text-sm font-medium text-gray-500">
                در حال دریافت نظرات...
              </p>
            </div>
          ) : allcomment.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-4">
              <p className="text-sm font-medium text-gray-400">
                نظری برای نمایش وجود ندارد
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="w-16 px-5 py-4 text-xs font-bold text-gray-500 hidden sm:table-cell">
                      ردیف
                    </th>

                    <th className="px-5 py-4 text-xs font-bold text-gray-500">
                      متن نظر
                    </th>

                    <th className="px-5 py-4 text-xs font-bold text-gray-500 hidden sm:table-cell">
                      نویسنده
                    </th>

                    <th className="px-5 py-4 text-xs font-bold text-gray-500">
                      تاریخ
                    </th>

                    <th className="px-5 py-4 text-xs font-bold text-gray-500 hidden sm:table-cell">
                      امتیاز
                    </th>

                    <th className="px-5 py-4 text-xs font-bold text-gray-500">
                      وضعیت
                    </th>

                    {activeTable === "pending" && hasReject && (
                      <th className="w-20 px-5 py-4 text-center text-xs font-bold text-gray-500">
                        ریجکت
                      </th>
                    )}

                    {activeTable === "pending" && hasConfirm && (
                      <th className="w-20 px-5 py-4 text-center text-xs font-bold text-gray-500">
                        تایید
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {allcomment.map((com, index) => {
                    return (
                      <tr
                        key={com.id}
                        className="
                        group
                        transition-colors duration-200
                        hover:bg-gray-50/80
                      "
                      >
                        <td className="px-5 py-4 text-xs font-medium text-gray-400 hidden sm:table-cell">
                          {(page - 1) * 5 + index + 1}
                        </td>

                        <td className="max-w-[280px] px-5 py-4">
                          <p className="line-clamp-2 text-sm font-medium leading-6 text-gray-700">
                            {com.content}
                          </p>
                        </td>

                        <td className="px-5 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                              {com.user.display_name?.charAt(0)}
                            </div>

                            <span className="max-w-[140px] truncate text-sm font-medium text-gray-700">
                              {com.user.display_name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-gray-500">
                            {new Date(com.created_at).toLocaleDateString(
                              "fa-IR",
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4 hidden sm:table-cell">
                          <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                            <span className="text-sm font-bold text-amber-600">
                              {com.rate}
                            </span>

                            <span className="text-xs text-amber-400">/ 5</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {com.is_confirmed === false ? (
                            <span
                              className="
                              inline-flex items-center gap-1.5
                              whitespace-nowrap
                              rounded-full
                              bg-amber-50
                              px-2.5 py-1.5
                              text-[11px]
                              font-semibold
                              text-amber-700
                            "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              در انتظار تایید
                            </span>
                          ) : (
                            <span
                              className="
                              inline-flex items-center gap-1.5
                              whitespace-nowrap
                              rounded-full
                              bg-green-50
                              px-2.5 py-1.5
                              text-[11px]
                              font-semibold
                              text-green-700
                            "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              تایید شده
                            </span>
                          )}
                        </td>

                        {activeTable === "pending" && hasReject && (
                          <td className="px-5 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRejectComment(com.id)}
                              aria-label="رد کردن نظر"
                              className="
                              inline-flex h-9 w-9
                              items-center justify-center
                              rounded-lg
                              bg-red-50
                              text-red-500
                              transition-all duration-200
                              hover:bg-red-100
                              hover:text-red-600
                              active:scale-95
                            "
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </td>
                        )}

                        {activeTable === "pending" && hasConfirm && (
                          <td className="px-5 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleConfirmComment(com.id)}
                              aria-label="تایید نظر"
                              className="
                              inline-flex h-9 w-9
                              items-center justify-center
                              rounded-lg
                              bg-green-50
                              text-green-600
                              transition-all duration-200
                              hover:bg-green-100
                              hover:text-green-700
                              active:scale-95
                            "
                            >
                              <FaCheck size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="pt-1">
          <ComponentPaginat
            currentPage={page}
            totalPages={totalPage}
            onPageChange={setPage}
          />
        </div>
      </div>

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
    </>
  );
};

export default ComponentTableComment;
