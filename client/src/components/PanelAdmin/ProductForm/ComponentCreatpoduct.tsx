import axiosClient from "../../../services/axiosClient";
import ProductFormComponent from "./ProductFormComponent";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../../Modal/SuccessModal";
import WarningModal from "../../../Modal/WarningModal ";
import { useState } from "react";

type payloadType = {
  name: string;
  slug: string;
  company: string;
  price_per_day: number;
  category_id: string;
  tags: any;
  can_rent: any;
  ownership: any;
  description?: string;
};

const ComponentCreatpoduct = () => {
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const handleAddProduct = async (data) => {
    try {
      const payload: payloadType = {
        name: String(data.name.trim()),
        slug: String(data.slug.trim()),
        company: String(data.company.trim()),
        price_per_day: Number(data.price_per_day),
        category_id: String(data.category_id.trim()),
        tags: data.tags,
        can_rent: data.can_rent ?? true,
        ownership: data.ownership ?? false,
      };
      if (data.description && data.description.trim() !== "") {
        payload.description = String(data.description).trim();
      }

      const response = await axiosClient.post(`/cars`, payload);
      console.log("Response to Creat new Product :", response);
      if (response.status === 201) {
        setIsSuccessOpen(true);
        setSuccessMessage("محصول شما با موفقیت ساخته شد ");
        setTimeout(() => {
          navigate("/panel/product");
        }, 5000);
      }
    } catch (err: any) {
      console.log("Error in creat new Produvt :", err);
      if (err.response?.status === 403) {
        setIsWarningOpen(true);
        setWarningMessage("شما مجوز لازم (owner or product.create) را ندارید");
      } else if (err.response?.status === 409) {
        setIsWarningOpen(true);
        setWarningMessage(
          "محصول با لینک مشابه در دیتابیس وجود دارد لطفا یک لینک دیگر انتخاب نمایید .",
        );
      }
    }
  };
  return (
    <div>
      <ProductFormComponent
        mode="create"
        onSubmit={handleAddProduct}
        submitButtonText="اضافه کردن ماشین"
      />
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
    </div>
  );
};

export default ComponentCreatpoduct;
