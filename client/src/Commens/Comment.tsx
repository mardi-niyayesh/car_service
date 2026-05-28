import { useForm } from "react-hook-form";
import axiosClient from "../services/axiosClient";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useState } from "react";
import SuccessModal from "../Modal/SuccessModal";
import WarningModal from "../Modal/WarningModal ";
type CommentForm = {
  rate?: number;
  content: string;
  parent_id: null | string;
};
const Comment = (replyToId: null) => {
  const { slug } = useParams();
  console.log("slug :", slug);

  const { allProduct } = useProduct();

  const [loading, setLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const {
    register,
  
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { content: "", rate: 5, parent_id: replyToId },
  });

  const product = allProduct.find((pro) => pro.slug === slug);
  console.log("inform product :", product);
 
  if (!product) {
    return <div>محصول مورد نظر یافت نشد</div>;
  }

 const selectedProduct = product.id;

  const onsubmit = async (data: CommentForm) => {
    setLoading(true);
    const payload: any = {
      content: String(data.content).trim(),
      rate: Number(data.rate ?? 5),
    };

    try {
      const response = await axiosClient.post(
        `comments/${selectedProduct}`,
        payload,
      );
      console.log("response to creat comment :", response);
      if (response.status === 201) {
        setIsSuccessOpen(true);
        setSuccessMessage(
          "کامنت شما با موفقیت ثبت شد پس از تایید توسط ادمین نشان داده خواهد شد",
        );
      }
    } catch (err: any) {
      console.log("Error in response creat comment :", err);
      if (err.response?.status === 404) {
        setIsWarningOpen(true);
        setWarningMessage(
          "ماشین مورد نظر برای  کامنت گذاشتن در دیتابیس وجود ندارد لطفا صفحه را رفرش کنید",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دیدگاه <span className="text-red-600">*</span>
            </label>
            <textarea
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="نظر خود را اینجا بنویسید..."
              {...register("content", {
                minLength: {
                  value: 2,
                  message: "کامنت باید حدالقل 2 کاراکتر باشد",
                },
                maxLength: {
                  value: 500,
                  message: "کامنت حدااکثر 500 کاراکتر می تواند باشد",
                },
              })}
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              امتیاز
              <span className="text-gray-500"> (اختیاری)</span>
            </label>
            <input
              type="number"
              placeholder="امتیاز..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
                errors.rate ? "border-red-500" : "border-gray-300"
              }`}
              {...register("rate", {
                min: {
                  value: 1,
                  message: "حدالقل  1 امتیاز ",
                },
                max: {
                  value: 5,
                  message: "حداکثر   5 امتیاز ",
                },
              })}
            />
            {errors.rate && (
              <p className="text-red-500 text-xs mt-1">{errors.rate.message}</p>
            )}
          </div>
          {replyToId && <input type="hidden" {...register("parent_id")} />}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full  px-6 py-3 bg-indigo-500 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 "
            >
              فرستادن دیدگاه
            </button>
          </div>
        </form>
      </div>
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
    </>
  );
};

export default Comment;
