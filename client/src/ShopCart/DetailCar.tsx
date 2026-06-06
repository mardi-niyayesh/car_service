import { useParams } from "react-router-dom";
import { useState } from "react"; // اضافه کردن import useState
import { useProduct } from "../hooks/useProduct";
import Des1Car from "./Des1Car";
import Des2Car from "./Des2Car";
import Des3Car from "./Des3Car";
import Des4Car from "./Des4Car";
import CommentForm from "../components/CommentForm/CommentForm";
import CommentOneProduct from "../components/CommentForm/CommentOneProduct";
import HeroBaner from "../components/Main/HeroBaner";
import PubliModal from "../Modal/PubliModal";

const DetailCar = () => {
  const { allProduct } = useProduct();
  const { slug } = useParams();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [showbtn, setShowbtn] = useState(false);

  const findProduct = allProduct.find((pro) => pro.slug === slug);
  const productId = findProduct?.id;

  const openReplyModal = (commentId: string) => {
    setReplyToId(commentId);
    setIsCommentModalOpen(true);
  };

  const openNewCommentModal = () => {
    setReplyToId(null);
    setIsCommentModalOpen(true);
  };

  const handleCommentSuccess = () => {
    setIsCommentModalOpen(false);
    setRefresh((prev) => prev + 1);
  };

  if (!findProduct) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-bold">
        محصولی یافت نشد
      </div>
    );
  }
  const handleClick = () => {
    setShowbtn((prev) => !prev);
  };

  return (
    <>
      <div
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="flex flex-col md:flex-row gap-6 md:justify-between">
          <div className="md:w-1/2 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <Des4Car />
              <Des3Car />
              <button
                onClick={handleClick}
                className="bg-gray-200 w-full hover:bg-gray-300 cursor-pointer  text-center text-gray-400 p-3 rounded-lg font-medium flex items-center justify-center gap-1.5 m-auto"
              >
                نمایش اطلاعات رزو خودرو
              </button>
              {!showbtn && (
                <>
                  <Des2Car />
                  <Des1Car />
                </>
              )}
            </div>
            {findProduct.description && <div className="mt-2"></div>}
          </div>
          <div className="left-5 w-1/2">
            <HeroBaner />
          </div>
        </div>
        <button
          onClick={openNewCommentModal}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          ثبت دیدگاه جدید
        </button>

        <CommentOneProduct
          productId={productId}
          onReply={openReplyModal}
          refreshTrigger={refresh}
        />
      </div>

      <PubliModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title={replyToId ? "پاسخ به دیدگاه" : "ثبت دیدگاه جدید"}
      >
        <CommentForm replyToId={replyToId} onSuccess={handleCommentSuccess} />
      </PubliModal>
    </>
  );
};

export default DetailCar;
