import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../../services/axiosClient";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import { FaUser, FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

type User = {
  id: string;
  display_name: string;
};
type allComment = {
  id: string;
  rate: number;
  user: User;
  content: string;
  created_at: string;
};
const CommentOneProduct = ({
  productId,
}: {
  productId: string | undefined;
}) => {
  const { id } = useParams();
  // console.log("slug for product :", id);
  const [page, setPage] = useState(1);
  const [allComment, setAllComment] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAllComment = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/cars/${productId}/comments?page=${page}&limit=10&order=desc`,
      );

      console.log("comments :", response);
      console.log(response.status);

      const dataComment = response.data.response.data.comments;
      console.log(dataComment);
      setAllComment(dataComment);

      const countComment = response.data.response.data.count;
      console.log("count comment to one Product :", countComment);

      const allPage = Math.ceil(countComment / 10);
      setTotalPages(allPage);
    } catch (err) {
      console.log("Error in get all comments :", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllComment();
  }, [page, productId]);

  if (!productId) return <p>محصولی یافت نشد</p>;
  if (loading) return <p>در حال بارگذاری نظرات...</p>;
  return (
    <>
      <div className="w-1/2 mt-5">
        {allComment?.map((coment: allComment, index: number) => (
          <div
            key={coment.id}
            className="border-b border-gray-300 mb-2 p-4"
          >
            <div>
              <div className="flex justify-between items-center mb-2 mt-2">
                <div className="flex items-center gap-2">
                  <FaUser style={{ opacity: 0.6 }} size={18} />
                  <h1>{coment.user.display_name}</h1>
                </div>
                <p>{coment.created_at}</p>
              </div>

              <div className="flex mb-2">
                {Array.from({ length: coment.rate }, (_, index) => (
                  <FaStar key={index} color="gold" size={18} />
                ))}
              </div>

              <p className="text-gray-600 mb-2">{coment.content}</p>
              <div className="flex items-end justify-end gap-2 cursor-pointer">
                <FaThumbsUp size={18} opacity={0.6} />
                <FaThumbsDown size={18} opacity={0.6} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <ComponentPaginat
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default CommentOneProduct;
