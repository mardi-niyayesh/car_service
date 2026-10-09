import { useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import Des1Car from "./Des1Car";
import Des2Car from "./Des2Car";
import Des3Car from "./Des3Car";
import Des4Car from "./Des4Car";
import CommentForm from "../components/CommentForm/CommentForm";
import CommentOneProduct from "../components/CommentForm/CommentOneProduct";
import HeroBaner from "../components/Main/HeroBaner";
import PubliModal from "../Modal/PubliModal";
import { motion } from "framer-motion";

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
        className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-1 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Des4Car />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: "easeOut",
                }}
              >
                <Des3Car />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <button
                  onClick={handleClick}
                  className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-yellow-500
                  p-3.5
                  text-center
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:bg-yellow-600
                  hover:shadow-md
                  active:scale-[0.98]
                "
                >
                  {showbtn ? "نمایش قوانین رزرو" : "مخفی کردن قوانین رزرو"}
                </button>
              </motion.div>

              {!showbtn && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Des2Car />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Des1Car />
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="w-full px-0 md:w-1/2 md:px-0 lg:w-2/5 md:ml-5"
          >
            <HeroBaner />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={openNewCommentModal}
            className="
            rounded-xl
            bg-yellow-500
            px-5
            py-3
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:bg-yellow-600
            hover:shadow-md
            active:scale-95
          "
          >
            ثبت دیدگاه جدید
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mt-8"
        >
          <CommentOneProduct
            productId={productId}
            onReply={openReplyModal}
            refreshTrigger={refresh}
          />
        </motion.div>
      </div>

      {/* Modal */}
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
