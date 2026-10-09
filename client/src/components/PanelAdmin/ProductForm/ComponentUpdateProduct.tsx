import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import ErrorModal from "../../../Modal/ErrorModal";
import axiosClient from "../../../services/axiosClient";
import ProductFormComponent, {
  type ProductFormType,
} from "./ProductFormComponent";

const ComponentUpdateProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [carId, setCarId] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] =
    useState<ProductFormType | undefined>(undefined);
  const [oldData, setOldData] =
    useState<ProductFormType | null>(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setWarningMessage("لینک محصول نامعتبر است.");
        setIsWarningOpen(true);
        return;
      }

      setIsLoading(true);

      try {
        const response = await axiosClient.get(`/cars/${slug}`);
        const carData = response.data?.response?.data?.car;

        if (!carData?.id) {
          throw new Error("داده‌های محصول معتبر نیست.");
        }

        const initial: ProductFormType = {
          id: carData.id,
          name: carData.name ?? "",
          slug: carData.slug ?? "",
          company: carData.company ?? "",
          price_per_day: carData.price_per_day ?? 0,
          category_id: carData.category_id ?? "",
          can_rent: carData.can_rent ?? true,
          ownership: carData.ownership ?? false,
          description: carData.description ?? "",
          tags: carData.tags ?? [],
          image: carData.image ?? "",
          rate: carData.rate ?? 0,
          _count: carData._count ?? {
            comments: 0,
            users_favorites: 0,
          },
        };

        setCarId(carData.id);
        setDefaultValues(initial);
        setOldData(initial);
      } catch (err: any) {
        console.error("خطا در دریافت ماشین:", err);

        setWarningMessage(
          err.response?.status === 404
            ? "این ماشین در دیتابیس وجود ندارد."
            : "خطا در دریافت اطلاعات ماشین."
        );
        setIsWarningOpen(true);

        setTimeout(() => navigate("/panel/product"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const handleUpdateProduct = async (
    productData: ProductFormType
  ) => {
    if (!carId || !oldData) {
      setWarningMessage("اطلاعات اولیه ماشین هنوز دریافت نشده است.");
      setIsWarningOpen(true);
      return;
    }

    const payload: Record<string, unknown> = {};

    // نام
    const newName = productData.name.trim();
    if (newName !== oldData.name.trim()) {
      payload.name = newName;
    }

    // اسلاگ: فقط در صورت تغییر ارسال می‌شود
    const newSlug = productData.slug.trim().toLowerCase();
    const oldSlug = oldData.slug.trim().toLowerCase();

    if (newSlug !== oldSlug) {
      payload.slug = newSlug;
    }

    // توضیحات
    const newDescription = (productData.description ?? "").trim();
    const oldDescription = (oldData.description ?? "").trim();

    if (newDescription !== oldDescription) {
      payload.description = newDescription;
    }

    // شرکت سازنده
    const newCompany = productData.company.trim();
    if (newCompany !== oldData.company.trim()) {
      payload.company = newCompany;
    }

    // دسته‌بندی
    if (productData.category_id !== oldData.category_id) {
      payload.category_id = productData.category_id;
    }

    // قیمت
    if (
      Number(productData.price_per_day) !==
      Number(oldData.price_per_day)
    ) {
      payload.price_per_day = Number(productData.price_per_day);
    }

    // قابلیت اجاره
    if (productData.can_rent !== oldData.can_rent) {
      payload.can_rent = productData.can_rent;
    }

    // مالکیت
    if (productData.ownership !== oldData.ownership) {
      payload.ownership = productData.ownership;
    }

    // برچسب‌ها
    const newTags = [...(productData.tags ?? [])].sort();
    const oldTags = [...(oldData.tags ?? [])].sort();

    if (JSON.stringify(newTags) !== JSON.stringify(oldTags)) {
      payload.tags = productData.tags;
    }

    // بررسی تغییرات
    if (Object.keys(payload).length === 0) {
      setWarningMessage("هیچ تغییری در فیلدها اعمال نشده است.");
      setIsWarningOpen(true);
      return;
    }

    // بررسی Payload قبل از ارسال
    console.log("Payload نهایی:", JSON.stringify(payload, null, 2));
    console.log("اسلاگ قبلی:", oldData.slug);
    console.log("اسلاگ فرم:", productData.slug);

    setIsLoading(true);

    try {
      await axiosClient.put(`/cars/${carId}`, payload);

      setIsSuccessOpen(true);
      setSuccessMessage("اطلاعات ماشین با موفقیت ویرایش شد.");

      setTimeout(() => {
        navigate("/panel/product");
      }, 3000);
    } catch (err: any) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      console.error("خطای سرور:", err.response?.data);
      console.error("Payload ارسال‌شده:", payload);
      console.error("وضعیت پاسخ:", status);

      const message = Array.isArray(serverMessage)
        ? serverMessage.join(" ")
        : String(serverMessage ?? "");

      if (status === 403) {
        setWarningMessage("شما مجوز لازم برای ویرایش ماشین را ندارید.");
      } else if (status === 404) {
        setWarningMessage("ماشین موردنظر پیدا نشد.");
      } else if (status === 409) {
        if (/slug/i.test(message)) {
          setWarningMessage("این اسلاگ قبلاً ثبت شده است.");
        } else if (/category_id/i.test(message)) {
          setWarningMessage("این دسته‌بندی با اطلاعات موجود تداخل دارد.");
        } else if (/\bname\b/i.test(message)) {
          setWarningMessage("این نام قبلاً ثبت شده است.");
        } else {
          setWarningMessage(message || "تداخل در اطلاعات ارسالی.");
        }
      } else {
        setErrorMessage("خطایی در سرور رخ داده است.");
        setIsErrorOpen(true);
        return;
      }

      setIsWarningOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {defaultValues && (
        <ProductFormComponent
          mode="update"
          defaultValues={defaultValues}
          onSubmit={handleUpdateProduct}
          submitButtonText="ویرایش ماشین"
          isLoading={isLoading}
          productId={carId}
        />
      )}

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

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={ErrorMessage}
      />
    </>
  );
};

export default ComponentUpdateProduct;