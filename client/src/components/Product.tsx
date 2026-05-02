//img
import car from "../../assets/carii.png";
const Product = () => {
  return (
    <div>
      <div className="max-w-[350px] border-2 border-[#D7D7D7] p-4 mt-10 rounded-2xl">
        <img src={car} alt="car" />
        <h2 className="font-bold text-[16px] text-[#0C0C0C] mb-2">
          اجاره بنز E350 سدان
        </h2>
        <div className="text-[#868686] text-[12px]">
          <span>مدل:</span>
          <span>2016</span>
        </div>
        <div className="flex items-center justify-between mb-2 bg-[#c6c3c3]  p-1">
          <div className="flex items-center justify-center">
            <span className="text-[#212121] text-[12px]">
              از ۱ تا 30 روز :{" "}
            </span>
            <span className="text-[#05164D] text-[16px] font-bold">
              8,500,000
            </span>
          </div>
          <p className="text-[#212121] text-[12px]">روزانه</p>
        </div>
        <div className="flex items-center justify-between mb-2 bg-[#c6c3c3] p-1">
          <div className="flex items-center justify-center">
            <span className="text-[#212121] text-[12px]">
              {" "}
              از ۱ تا 30 روز :
            </span>
            <span className="text-[#05164D] text-[16px] font-bold">
              8,500,000
            </span>
          </div>
          <p className="text-[#212121] text-[12px]">ماهانه</p>
        </div>
        <div className="flex items-center justify-between mb-2 border-b-2 border-[#D7D7D7]">
          <p className="text-[#212121] text-[12px]">مبلغ ضمانت:</p>
          <p className="text-[#212121]  font-bold text-[12px] mb-2">
            80 میلیون تومان
          </p>
        </div>
        <button className="bg-[#194BF0] text-[#FFFFFF] w-full px-4 py-2 rounded-2xl">
          درخواست رزرو
        </button>
      </div>
    </div>
  );
};

export default Product;
