import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import { useState, useEffect } from "react";
import { FaCheck, FaTimesCircle } from "react-icons/fa";

import axiosClient from "../../../services/axiosClient";
type CommentType = {
  rate: number;
  id: string;
  content: string;
};
const ComponentTableComment = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allcomment, setAllComment] = useState<CommentType[]>([]);

  const fetchAllComment = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/comments/unconfirmed?page=${page}&limit=5&order=desc`,
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

  const handleRejectComment = () => {};
  const handleConfirmComment = () => {};
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
                <th className="w-32 px-4 py-3 font-medium">نظر </th>

                <th className="w-32 px-4 py-3 font-medium">امتیاز </th>

                <th className="w-20 px-4 py-3 font-medium"> ریجکت</th>

                <th className="w-20 px-4 py-3 font-medium"> تایید</th>
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
                    <td className="px-4 py-3  sm:table-cell">{com.rate}/5</td>
                    <td>
                      <FaTimesCircle
                        color="red"
                        size={20}
                        onClick={() => handleRejectComment()}
                      />
                    </td>
                    <td>
                      <FaCheck
                        color="green"
                        size={20}
                        onClick={() => handleConfirmComment()}
                      />
                    </td>
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
    </>
  );
};

export default ComponentTableComment;
