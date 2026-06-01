import ComponentPaginat from "../../Paginate/ComponentPaginat";
import { useState, useEffect } from "react";
import { FaCheck, FaTimesCircle } from "react-icons/fa";
import { useUser } from "../../hooks/useUser";
import axiosClient from "../../services/axiosClient";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { useParams } from "react-router-dom";
type User = {
  display_name: string;
};
type CommentType = {
  rate: number;
  id: string;
  content: string;
  user: User;
  created_at: string;
  is_confirmed: boolean;
};
const ComponentTableComment = () => {
  const { hasPermission, hasRole } = useUser();
  const { id } = useParams();
  console.log(id);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allcomment, setAllComment] = useState<CommentType[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");
  const [isErroOpen, setIsErroOpen] = useState(false);

  const hasReject =
    hasPermission("comment.reject") || hasRole("comment_manager");
  const hasConfirm =
    hasPermission("comment.confirm") || hasRole("comment_manager");
  const fetchAllComment = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/comments/unconfirmed?page=${page}&limit=10&order=desc&car=${id}`,
      );
      const dataComment = response.data.response.data.comments;
      console.log("response to Get All Comments :", dataComment);
      setAllComment(dataComment);

      const totalItems = response.data.response.data.count;
      const calculatedTotalPages = Math.ceil(totalItems / 5);

      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.log("Error in get all comment :", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllComment();
  }, [page]);

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
      console.log("Error in reject comment : ", err);
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
      console.log("Error in tick comment :", err);
      if (err.response?.status === 400) {
        setIsWarningOpen(true);
        setWarningMessage(
          "کامنت مورد نظر برای تایید کردن در دیتابیس یافت نشد لطفا صفحه رو رفرش کنید",
        );
      }
    }
  };
  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        {loading ? (
          <p className="text-center text-gray-500 py-8">
            در حال گرفتن همه کامنت ها ...
          </p>
        ) : (
          <table className="min-w-full  text-right text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 ">
              <tr>
                <th className="w-12 px-4 py-3 font-medium hidden sm:table-cell">
                  ردیف
                </th>
                <th className="w-32 px-4 py-3 font-medium">متن </th>
                <th className="w-32 px-4 py-3 font-medium hidden sm:table-cell">نویسنده </th>
                <th className="w-32 px-4 py-3 font-medium">تاریخ ایجاد </th>
                <th className="w-32 px-4 py-3 font-medium hidden sm:table-cell">امتیاز </th>
                <th className="w-32 px-4 py-3 font-medium">وضعیت </th>
                {hasReject && (
                  <th className="w-20 px-4 py-3 font-medium"> ریجکت</th>
                )}
                {hasConfirm && (
                  <th className="w-20 px-4 py-3 font-medium"> تایید</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allcomment.map((com, index) => {
                return (
                  <tr
                    className="hover:bg-gray-300 transition-colors"
                    key={com.id}
                  >
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {(page - 1) * 5 + index + 1}
                    </td>
                    <td className="px-4 py-3  sm:table-cell">{com.content}</td>
                    <td className="px-4 py-3  hidden sm:table-cell">
                      {com.user.display_name}
                    </td>
                    <td className="px-4 py-3  sm:table-cell">
                      {new Date(com.created_at).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-4 py-3  hidden sm:table-cell">{com.rate}/5</td>
                    <td className="px-4 py-3  sm:table-cell">
                      {!com.is_confirmed && (
                        <span className="text-white text-[12px] bg-gray-400 rounded-2xl pr-1.5 pl-1.5">
                          در انتظار تایید
                        </span>
                      )}
                    </td>
                    <td>
                      {hasReject && (
                        <FaTimesCircle
                          color="red"
                          size={20}
                          onClick={() => handleRejectComment(com.id)}
                        />
                      )}
                    </td>
                    {hasConfirm && (
                      <td>
                        <FaCheck
                          color="green"
                          size={20}
                          onClick={() => handleConfirmComment(com.id)}
                        />
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
    </>
  );
};

export default ComponentTableComment;
