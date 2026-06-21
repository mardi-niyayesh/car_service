import { useForm } from "react-hook-form";
import axiosClient from "../../services/axiosClient";
import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useState } from "react";
import SuccessModal from "../../Modal/SuccessModal";
import WarningModal from "../../Modal/WarningModal ";
import { useUser } from "../../hooks/useUser";

type CommentForm = {
  rate?: number;
  content: string;
  parent_id: string | null;
};

type CommentProps = {
  replyToId?: string | null;
  onSuccess?: () => void;
};

const CommentForm = ({ replyToId, onSuccess }: CommentProps) => {
  const { slug } = useParams();
  const { user } = useUser();
  // console.log("user :", user);

  const { allProduct } = useProduct();

  const [loading, setLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentForm>({
    defaultValues: { content: "", rate: 5, parent_id: replyToId || null },
  });

  const product = allProduct.find((pro) => pro.slug === slug);
  if (!product) return <div>محصول مورد نظر یافت نشد</div>;
  const selectedProduct = product.id;

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    reset();
    if (onSuccess) onSuccess();
  };

  const handleWarningClose = () => {
    setIsWarningOpen(false);
  };

  const onSubmit = async (data: CommentForm) => {
    if (!user) {
      setTimeout(() => {
        setWarningMessage("برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید.");
        setIsWarningOpen(true);
      }, 2000);

      return;
    }

    setLoading(true);

    const payload: any = {
      content: String(data.content).trim(),
      rate: Number(data.rate ?? 5),
    };
    if (data.parent_id) payload.parent_id = data.parent_id;
    console.log("Payload sent:", payload);
    try {
      const response = await axiosClient.post(
        `comments/${selectedProduct}`,
        payload,
      );
      if (response.status === 201) {
        setIsSuccessOpen(true);
        setSuccessMessage(
          "کامنت شما با موفقیت ثبت شد پس از تایید توسط ادمین نشان داده خواهد شد",
        );
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (err.response?.status === 404) {
        setWarningMessage(
          "ماشین مورد نظر برای کامنت گذاشتن در دیتابیس وجود ندارد، لطفا صفحه را رفرش کنید",
        );
        setIsWarningOpen(true);
      } else {
        setWarningMessage("خطایی در سرور رخ داده است. لطفاً دوباره تلاش کنید.");
        setIsWarningOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block  text-gray-700 mb-2">
            دیدگاه <span className="text-red-600">*</span>
          </label>
          <textarea
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="دیدگاه خود را اینجا بنویسید..."
            {...register("content", {
              required: "دیدگاه نمی تواند خالی باشد",
              minLength: {
                value: 2,
                message: "کامنت باید حداقل 2 کاراکتر باشد",
              },
              maxLength: {
                value: 500,
                message: "کامنت حداکثر 500 کاراکتر می تواند باشد",
              },
            })}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            امتیاز <span className="text-gray-500">(اختیاری)</span>
          </label>
          <input
            type="number"
            placeholder="امتیاز..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rate ? "border-red-500" : "border-gray-300"
            }`}
            {...register("rate", {
              min: { value: 1, message: "حداقل 1 امتیاز" },
              max: { value: 5, message: "حداکثر 5 امتیاز" },
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
            disabled={loading}
            className="w-full px-6 py-3 bg-yellow-500 text-white font-medium rounded-md shadow-sm hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "فرستادن دیدگاه"}
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        message={successMessage}
      />
      <WarningModal
        isOpen={isWarningOpen}
        onClose={handleWarningClose}
        message={warningMessage}
      />
    </>
  );
};

export default CommentForm;
