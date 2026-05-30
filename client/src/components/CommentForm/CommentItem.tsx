import { FaUser, FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { type CommentWithReplies } from "./buildCommentTree";
import { FaReply } from "react-icons/fa";

const CommentItem = ({
  comment,
  onReply,
}: {
  comment: CommentWithReplies;
  onReply?: (id: string) => void;
}) => {
  return (
    <div className="mb-5  rounded-xl bg-white mt-5">
      <div className="p-5 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
              <FaUser size={14} />
            </div>
            <h1 className="font-medium text-gray-800 text-sm md:text-base">
              {comment.user.display_name}
            </h1>
          </div>
          <p className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {new Date(comment.created_at).toLocaleDateString("fa-IR")}
          </p>
        </div>

        <div className="flex mb-3">
          {Array.from({ length: comment.rate }, (_, i) => (
            <FaStar
              key={i}
              className="text-yellow-400 drop-shadow-sm"
              size={16}
            />
          ))}
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
          {comment.content}
        </p>

        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-1">
          <div className="flex gap-4 text-gray-500">
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200 cursor-pointer">
              <FaThumbsUp size={18} />
              <span className="text-xs">لایک</span>
            </button>
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors duration-200 cursor-pointer">
              <FaThumbsDown size={18} />
              <span className="text-xs">دیسلایک</span>
            </button>
          </div>
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1"
            >
              <FaReply size={15}/>
              <span className="font-bold">پاسخ</span>
            </button>
          )}
        </div>
      </div>

    
      {comment.replies && comment.replies.length > 0 && (
        <div className="mr-6 border-r-2 border-blue-100 pr-4 mt-2 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
