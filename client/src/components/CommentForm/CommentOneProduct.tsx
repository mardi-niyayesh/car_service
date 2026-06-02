import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import ComponentPaginat from "../../Paginate/ComponentPaginat";
import CommentItem from "./CommentItem";

export type allComment = {
  id: string;
  rate: number;
  user: { id: string; display_name: string };
  content: string;
  created_at: string;
  parent_id: null;
  replies?: any[]; 
};

const CommentOneProduct = ({
  productId,
  onReply,
  refreshTrigger,
}: {
  productId: string | undefined;
  onReply?: (commentId: string) => void;
  refreshTrigger?: number;
}) => {
  const [page, setPage] = useState(1);
  const [allComment, setAllComment] = useState<allComment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const fetchRepliesForComment = async (commentId: string) => {
    try {
      const response = await axiosClient.get(
        `/comments/${commentId}/replies?page=1&limit=10&order=asc`
      );
      return response.data.response.data.comments || [];
    } catch (err) {
      console.log(`Error fetch replies  ${commentId}:`, err);
      return [];
    }
  };

  const fetchAllComment = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/cars/${productId}/comments?page=${page}&limit=10&order=desc`
      );
      const mainComments = response.data.response.data.comments;
      
  
      setLoadingReplies(true);
      const commentsWithReplies = await Promise.all(
        mainComments.map(async (comment: any) => {
          const replies = await fetchRepliesForComment(comment.id);
          return { ...comment, replies };
        })
      );
      setAllComment(commentsWithReplies);
      
      const countComment = response.data.response.data.count;
      setTotalPages(Math.ceil(countComment / 10));
    } catch (err) {
      console.log("Error in get all comments:", err);
    } finally {
      setLoading(false);
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    fetchAllComment();
  }, [page, productId, refreshTrigger]);

  useEffect(() => {
    if (refreshTrigger !== undefined) setPage(1);
  }, [refreshTrigger]);

  if (!productId) return <p>محصولی یافت نشد</p>;
  if (loading) return <p>در حال بارگذاری نظرات...</p>;

  return (
    <>
      <div className="md:w-1/2 w-full">
        {allComment.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={onReply} />
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