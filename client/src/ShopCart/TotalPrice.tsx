import { useProduct } from "../hooks/useProduct";
import { useParams } from "react-router-dom";
const TotalPrice = () => {
  const { allProduct } = useProduct();
  const { id } = useParams();

  const findProduct = allProduct.find((pro) => pro.id === id);
  return (
    <>
      <div className="flex items-center justify-center">
        <span className="text-[#212121] text-[12px]">هزینه :</span>
        <span className="text-[#05164D] text-[16px] font-bold">
          {findProduct?.price_per_day}
        </span>
      </div>
    </>
  );
};

export default TotalPrice;
